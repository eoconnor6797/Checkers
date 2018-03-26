defmodule CheckersWeb.GamesChannel do
  use CheckersWeb, :channel
  alias Checkers.Game
  alias Phoenix.Socket
  alias Checkers.Agent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Checkers.Agent.get(name) || Game.new()
      user = Map.get(payload, "user")
      game = Game.join(game, user)
      IO.inspect(user)
      IO.inspect(game)
      Checkers.Agent.put(name, game)
      socket = socket
        |> assign(:name, name)
      send(self, :after_join)
      {:ok, %{"join" => name}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end
  def handle_info(:after_join, socket) do
    game = Checkers.Agent.get(socket.assigns[:name])
    broadcast socket, "update", game
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    name = socket.assigns[:name]
    game = Checkers.Agent.get(name)
    turn = Map.get(game, "turn")
    player_turn = Map.get(game, turn)
    user = Map.get(payload, "user")
    pos = Map.get(payload, "pos")
    board = Map.get(game, "board")
    if (Game.valid_turn(board, user, turn, player_turn, pos)) do
      pos = Map.get(payload, "pos")
      game = Map.put(game, "pos1", pos)
      game = Map.put(game, "selected", true)
      Agent.put(name, game)
      broadcast_from socket, "update", game
    end
    {:reply, {:ok, game}, socket}
  end

  def handle_in("push", payload, socket) do
    name = socket.assigns[:name]
    game = Checkers.Agent.get(name)
    pos1 = Map.get(payload, "pos1")
    pos2 = Map.get(payload, "pos2")
    turn = Map.get(game, "turn")
    player_turn = Map.get(game, turn)
    user = Map.get(payload, "user")
    board = Map.get(game, "board")
    if (Game.valid_turn(board, user, turn, player_turn, pos1)) do
      game = Game.move(game, pos1, pos2)
      Agent.put(name, game)
      IO.inspect(payload)
      broadcast_from socket, "update", game
    end
    {:reply, {:ok, game}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_in("withdraw", payload, socket) do
    name = socket.assigns[:name]
    game = Checkers.Agent.get(name)
    game = Game.withdraw(game, Map.get(payload, "user"))
    Agent.put(name, game)
    broadcast socket, "update", game
    {:reply, {:ok, game}, socket}
  end

  def handle_in("reset", _, socket) do
    game = Checkers.Agent.get(socket.assigns[:name])
    game = Game.play_again(game)
    Checkers.Agent.put(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    broadcast socket, "update", game
    {:reply, {:ok, game}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
