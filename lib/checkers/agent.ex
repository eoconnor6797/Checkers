defmodule Checkers.Agent do
  use Agent
  #Based on documentation found here: https://hexdocs.pm/elixir/Agent.html
  #and Nat's lecture Notes
  def start_link() do
    Agent.start_link(fn -> MapSet.new end, name: __MODULE__)
  end

  def put(name, game) do
    Agent.update(__MODULE__, &Map.put(&1, name, game))
  end

  def get(name) do
    Agent.get(__MODULE__, &Map.get(&1, name))
  end
end
