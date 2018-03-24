defmodule Checkers.Game do

  def remove(game, pos) do
    new_piece = %{"color" => "blue", "king" => false}
    row = Enum.at(game, Map.get(pos,"x"))
    new_row = List.replace_at(row, Map.get(pos, "y"), new_piece)
    game = List.replace_at(game, Map.get(pos, "x"), new_row)
    IO.puts("\n")
    IO.inspect(pos)
    IO.puts("\n")
    game
  end 

  def do_move(game, x1, y1, x2, y2) do
    row = Enum.at(game, x1)
    piece = Enum.at(row, y1)
    new_row = Enum.at(game, x2)
    new_row = List.replace_at(new_row, y2, piece)
    game = remove(game, %{"x" => x1, "y" => y1})
    game = List.replace_at(game, x2, new_row)
    game
  end

  def move(game, pos1, pos2) do
    x1 = Map.get(pos1,"x")
    y1 = Map.get(pos1, "y")
    x2 = Map.get(pos2, "x")
    y2 = Map.get(pos2, "y")
    cond do
      valid_move(game, x1, y1, x2, y2) ->
        %{"board" => do_move(game, x1, y1, x2, y2), "selected" => false, "pos1" => %{x: -1, y: -1}}
        valid_jump(game, x1, y1, x2, y2) ->
        %{"board" => do_jump(game, x1, y1, x2, y2), "selected" => false, "pos1" => %{x: -1, y: -1}}
        true ->
      %{"board" => game, "selected" => false, "pos1" => %{x: -1, y: -1}}
    end
  end

  def do_jump(game, x1, y1, x2, y2) do
    row = Enum.at(game, x1)
    piece = Enum.at(row, y1)
    new_row = Enum.at(game, x2)
    new_row = List.replace_at(new_row, y2, piece)
    game = remove(game, %{"x" => x1, "y" => y1})
    case Map.get(piece, "color") do
      "Cornsilk" -> 
        if (y1 - y2) == -2 do
          game = remove(game, %{"x" => (x1 - 1), "y" => (y1 + 1) })
          game = List.replace_at(game, x2, new_row)
          game
        else
          game = remove(game, %{"x" => (x1 - 1), "y" => (y1 - 1) })
          game = List.replace_at(game, x2, new_row)
          game
        end
      "black" ->
        if (y1 - y2) == -2 do
          game = remove(game, %{"x" => (x1 + 1), "y" => (y1 + 1) })
          game = List.replace_at(game, x2, new_row)
          game
        else
          game = remove(game, %{"x" => (x1 + 1), "y" => (y1 - 1) })
          game = List.replace_at(game, x2, new_row)
          game
        end
    end
  end

  def valid_jump(game, x1, y1, x2, y2) do
    piece = Enum.at(Enum.at(game, x1), y1)
    color = Map.get(piece, "color")
    dest = Enum.at(Enum.at(game, x2), y2)
    if (Map.get(dest, "color") != "blue") do
      false
    else
      case color do
        "black" -> valid_jump_black(game, x1, y1, x2, y2)
        "Cornsilk" -> valid_jump_white(game, x1, y1, x2, y2)
        "blue" -> false
      end
    end
  end

  def valid_jump_black(game, x1, y1, x2, y2) do
    if (abs(x1 - x2) != 2) do
      false
    else
      case (y1 - y2) do
        -2 ->
          piece = Enum.at(Enum.at(game, x1 + 1), y1 + 1)
          color = Map.get(piece, "color")
          case color do
            "Cornsilk" -> true
            _ -> false
          end
        2 ->
          piece = Enum.at(Enum.at(game, x1 + 1), y1 - 1)
          color = Map.get(piece, "color")
          case color do
            "Cornsilk" -> true
            _ -> false
          end
      end
    end
  end
  
  def valid_jump_white(game, x1, y1, x2, y2) do
    if (abs(x1 - x2) != 2) do
      false
    else
      IO.puts(y1 - y1)
      case (y1 - y2) do
        -2 ->
          piece = Enum.at(Enum.at(game, x1 - 1), y1 + 1)
          color = Map.get(piece, "color")
          case color do
            "black" -> true
            _ -> false
          end
        2 ->
          piece = Enum.at(Enum.at(game, x1 - 1), y1 - 1)
          color = Map.get(piece, "color")
          case color do
            "black" -> true
            _ -> false
          end
      end
    end
  end

  def valid_move(game, x1, y1, x2, y2) do
    piece = Enum.at(Enum.at(game, x1), y1)
    color = Map.get(piece, "color")
    dest = Enum.at(Enum.at(game, x2), y2)
    if (Map.get(dest, "color") != "blue") do
      false
    else
      case color do
        "black" -> valid_move_black(game, x1, y1, x2, y2)
        "Cornsilk" -> valid_move_white(game, x1, y1, x2, y2)
        "blue" -> false
      end
    end
  end

  def valid_move_black(game, x1, y1, x2, y2) do
    x1 < x2 and (abs(x1 - x2) == 1) and (abs(y1 - y2) < 2)
  end

  def valid_move_white(game, x1, y1, x2, y2) do
    x1 > x2 and (abs(x1 - x2) == 1) and (abs(y1 - y2) < 2)
  end 

  def new() do
    %{
      "board" => init(),
      "selected" => false,
      "pos1" => %{x: -1, y: -1},
    }
  end

  def make_piece(ii, jj) do
    black = %{"color" => "black", "king" => false} 
    blue = %{"color" => "blue", "king" => false} 
    corn = %{"color" => "Cornsilk", "king" => false} 
    cond do
      rem((ii+jj), 2) == 0 -> 
        black
      (ii < 3) ->
        black
      (ii >= 3 and ii < 5) ->
        blue
      true ->
        corn
    end
  end

  def make_row(row, ii, 8) do
    row
  end

  def make_row(row, ii, jj) do
    List.insert_at(row, jj, make_piece(ii, jj))
    |> make_row(ii, jj + 1)
  end

  def make_rows(board, 8) do
    board
  end

  def make_rows(board, ii) do
    List.insert_at(board, ii, make_row([], ii, 0))
    |> make_rows(ii + 1)
  end

  def init() do
    board = []
    make_rows([], 0)
  end

end
