defmodule CheckersWeb.GamesChannel do
  use CheckersWeb, :channel
  alias Checkers.Game
  alias Phoenix.Socket
  alias Checkers.Agent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Checkers.Agent.get(name) || Game.new()
      IO.inspect(game)
      Checkers.Agent.put(name, game)
      socket = socket
      |> assign(:name, name)
      {:ok, %{"join" => name}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    name = socket.assigns[:name]
    game = Checkers.Agent.get(name)
    pos = Map.get(payload, "pos")
    game = Map.put(game, "pos1", pos)
    game = Map.put(game, "selected", true)
    Agent.put(name, game)
    broadcast_from socket, "update", game
    {:reply, {:ok, game}, socket}
  end

  def handle_in("push", payload, socket) do
    name = socket.assigns[:name]
    game = Checkers.Agent.get(name)
    pos1 = Map.get(payload, "pos1")
    pos2 = Map.get(payload, "pos2")
    payload = Game.move(Map.get(game, "board"), pos1, pos2)
    Agent.put(name, payload)
    IO.inspect(payload)
    broadcast_from socket, "update", payload
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
