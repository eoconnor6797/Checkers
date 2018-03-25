defmodule CheckersWeb.PageController do
  use CheckersWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    user = get_session(conn, :user)
    render conn, "game.html", game: params["game"], user: user
  end

  def join(conn, %{"join_data" => join}) do
    conn
    |> put_session(:user, join["user"])
    |> redirect(to: "/game/" <> join["game"])
  end
end
