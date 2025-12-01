import random
import os
import sys
from typing import List, Optional, Tuple

class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]  # 3x3 board
        self.current_winner = None
        self.human_player = 'X'  # Default
        self.ai_player = 'O'     # Default
        self.difficulty = 'medium'
        
    def print_board(self):
        """Display the current board state"""
        os.system('cls' if os.name == 'nt' else 'clear')
        print("\n" + "="*30)
        print("      TIC-TAC-TOE GAME")
        print("="*30)
        print(f"\nYou: {self.human_player} | AI: {self.ai_player}")
        print(f"Difficulty: {self.difficulty.capitalize()}")
        print("\nCurrent Board:")
        print()
        for i in range(3):
            print(" " * 10 + " | ".join(self.board[i*3:(i+1)*3]))
            if i < 2:
                print(" " * 10 + "-" * 9)
        print()
        
    def print_board_nums(self):
        """Display board with position numbers for reference"""
        print("\nPosition Numbers:")
        number_board = [[str(i) for i in range(j*3, (j+1)*3)] for j in range(3)]
        for row in number_board:
            print(" " * 10 + " | ".join(row))
        print()
    
    def available_moves(self) -> List[int]:
        """Return list of available moves"""
        return [i for i, spot in enumerate(self.board) if spot == ' ']
    
    def empty_squares(self) -> bool:
        """Check if there are empty squares"""
        return ' ' in self.board
    
    def num_empty_squares(self) -> int:
        """Return number of empty squares"""
        return self.board.count(' ')
    
    def make_move(self, square: int, letter: str) -> bool:
        """Make a move on the board"""
        if self.board[square] == ' ':
            self.board[square] = letter
            if self.winner(square, letter):
                self.current_winner = letter
            return True
        return False
    
    def winner(self, square: int, letter: str) -> bool:
        """Check if the current move wins the game"""
        # Check row
        row_ind = square // 3
        row = self.board[row_ind*3:(row_ind+1)*3]
        if all([spot == letter for spot in row]):
            return True
            
        # Check column
        col_ind = square % 3
        column = [self.board[col_ind+i*3] for i in range(3)]
        if all([spot == letter for spot in column]):
            return True
            
        # Check diagonals
        if square % 2 == 0:  # Only middle and corners are on diagonals
            diagonal1 = [self.board[i] for i in [0, 4, 8]]
            if all([spot == letter for spot in diagonal1]):
                return True
            diagonal2 = [self.board[i] for i in [2, 4, 6]]
            if all([spot == letter for spot in diagonal2]):
                return True
                
        return False
    
    def get_human_move(self):
        """Get valid move from human player"""
        while True:
            try:
                move = input(f"Enter your move (0-8): ").strip()
                if move.lower() in ['q', 'quit', 'exit']:
                    return None
                    
                square = int(move)
                if square not in range(9):
                    print("Invalid move. Please choose a number between 0 and 8.")
                elif self.board[square] != ' ':
                    print("That square is already taken. Choose another.")
                else:
                    return square
            except ValueError:
                print("Invalid input. Please enter a number between 0 and 8, or 'q' to quit.")
    
    def minimax(self, is_maximizing: bool, depth: int = 0) -> Tuple[int, int]:
        """Minimax algorithm with alpha-beta pruning"""
        alpha = float('-inf')
        beta = float('inf')
        return self._minimax(is_maximizing, depth, alpha, beta)
    
    def _minimax(self, is_maximizing: bool, depth: int, alpha: float, beta: float) -> Tuple[int, int]:
        """Recursive minimax implementation with alpha-beta pruning"""
        
        # Base cases
        if self.current_winner == self.ai_player:
            return 10 - depth, None
        elif self.current_winner == self.human_player:
            return depth - 10, None
        elif not self.empty_squares():
            return 0, None
            
        # Difficulty adjustments
        if self.difficulty == 'easy':
            # Random moves for easy difficulty
            if random.random() < 0.5:
                return 0, random.choice(self.available_moves())
        
        # Maximizing player (AI)
        if is_maximizing:
            best_score = float('-inf')
            best_move = None
            
            for move in self.available_moves():
                # Make move
                self.board[move] = self.ai_player
                if self.winner(move, self.ai_player):
                    self.current_winner = self.ai_player
                
                # Recursive call
                score, _ = self._minimax(False, depth + 1, alpha, beta)
                
                # Undo move
                self.board[move] = ' '
                self.current_winner = None
                
                if score > best_score:
                    best_score = score
                    best_move = move
                
                alpha = max(alpha, best_score)
                if beta <= alpha:
                    break  # Beta cut-off
                    
            return best_score, best_move
        
        # Minimizing player (Human)
        else:
            best_score = float('inf')
            best_move = None
            
            for move in self.available_moves():
                # Make move
                self.board[move] = self.human_player
                if self.winner(move, self.human_player):
                    self.current_winner = self.human_player
                
                # Recursive call
                score, _ = self._minimax(True, depth + 1, alpha, beta)
                
                # Undo move
                self.board[move] = ' '
                self.current_winner = None
                
                if score < best_score:
                    best_score = score
                    best_move = move
                
                beta = min(beta, best_score)
                if beta <= alpha:
                    break  # Alpha cut-off
                    
            return best_score, best_move
    
    def get_ai_move(self) -> int:
        """Get AI move based on difficulty level"""
        available = self.available_moves()
        
        # Easy: Random moves with occasional smart play
        if self.difficulty == 'easy':
            if random.random() < 0.3:  # 30% chance to make a smart move
                return self.get_best_move()
            return random.choice(available)
        
        # Medium: Minimax with limited depth
        elif self.difficulty == 'medium':
            if len(available) > 6:  # Early game: random or simple strategy
                # Try to take center or corners first
                if 4 in available:
                    return 4
                corners = [0, 2, 6, 8]
                available_corners = [c for c in corners if c in available]
                if available_corners:
                    return random.choice(available_corners)
                return random.choice(available)
            else:
                # Use minimax for later game
                return self.get_best_move()
        
        # Hard: Full minimax
        else:
            return self.get_best_move()
    
    def get_best_move(self) -> int:
        """Get the best move using minimax"""
        _, move = self.minimax(True)
        return move if move is not None else random.choice(self.available_moves())
    
    def play_game(self):
        """Main game loop"""
        self.print_welcome()
        
        # Game setup
        self.setup_game()
        
        # Determine who goes first (X always goes first)
        if self.human_player == 'X':
            current_player = self.human_player
            print("\nYou go first (X always starts)!")
        else:
            current_player = self.ai_player  # AI is X, so AI goes first
            print(f"\nAI goes first (X always starts)! You are playing as O.")
        
        input("\nPress Enter to start the game...")
        
        # Main game loop
        game_active = True
        
        while game_active:
            self.print_board()
            self.print_board_nums()
            
            if current_player == self.human_player:
                print(f"\nYour turn ({self.human_player})")
                square = self.get_human_move()
                
                if square is None:
                    print("\nThanks for playing!")
                    return
                    
                if not self.make_move(square, self.human_player):
                    print("Invalid move. Try again.")
                    continue
                    
            else:
                print(f"\nAI's turn ({self.ai_player})")
                print("Thinking...")
                
                # Add a small delay for realism
                import time
                time.sleep(0.5 + random.random())
                
                square = self.get_ai_move()
                self.make_move(square, self.ai_player)
                print(f"AI chose position {square}")
            
            # Check for winner or tie
            if self.current_winner:
                self.print_board()
                if self.current_winner == self.human_player:
                    print(f"\n{'='*40}")
                    print("   CONGRATULATIONS! YOU WIN! 🎉")
                    print('='*40)
                else:
                    print(f"\n{'='*40}")
                    print("   AI WINS! Better luck next time! 🤖")
                    print('='*40)
                game_active = False
            elif not self.empty_squares():
                self.print_board()
                print(f"\n{'='*40}")
                print("   IT'S A TIE! Good game! 🤝")
                print('='*40)
                game_active = False
            
            # Switch players
            current_player = self.ai_player if current_player == self.human_player else self.human_player
        
        self.play_again()
    
    def setup_game(self):
        """Set up game options"""
        print("\nGame Setup:")
        print("-" * 20)
        
        # Choose difficulty
        while True:
            print("\nChoose difficulty level:")
            print("1. Easy (AI makes random moves)")
            print("2. Medium (AI uses basic strategy)")
            print("3. Hard (AI uses advanced algorithm)")
            
            choice = input("\nEnter choice (1-3): ").strip()
            if choice == '1':
                self.difficulty = 'easy'
                break
            elif choice == '2':
                self.difficulty = 'medium'
                break
            elif choice == '3':
                self.difficulty = 'hard'
                break
            else:
                print("Invalid choice. Please enter 1, 2, or 3.")
        
        # Choose symbol (but X always goes first)
        while True:
            choice = input("\nDo you want to play as X or O? (X always goes first): ").strip().upper()
            if choice in ['X', 'O']:
                self.human_player = choice
                self.ai_player = 'O' if choice == 'X' else 'X'
                print(f"\nYou chose to play as {self.human_player}")
                print(f"AI will play as {self.ai_player}")
                print(f"Note: X always goes first in Tic-Tac-Toe!")
                
                if self.human_player == 'X':
                    print("You will make the first move.")
                else:
                    print("AI (playing as X) will make the first move.")
                break
            else:
                print("Invalid choice. Please enter X or O.")
    
    def print_welcome(self):
        """Display welcome message"""
        os.system('cls' if os.name == 'nt' else 'clear')
        print("\n" + "="*50)
        print("         WELCOME TO TIC-TAC-TOE!")
        print("="*50)
        print("\nRules:")
        print("- Get 3 of your symbols in a row (horizontal,")
        print("  vertical, or diagonal) to win.")
        print("- X always goes first in Tic-Tac-Toe!")
        print("- Use the number keys 0-8 to make your moves.")
        print("- Type 'q', 'quit', or 'exit' to quit the game.")
        print("\nBoard Positions:")
        self.print_board_nums()
    
    def play_again(self):
        """Ask if player wants to play again"""
        while True:
            choice = input("\nPlay again? (y/n): ").strip().lower()
            if choice in ['y', 'yes']:
                # Reset game
                self.board = [' ' for _ in range(9)]
                self.current_winner = None
                self.play_game()
                break
            elif choice in ['n', 'no']:
                print("\nThanks for playing! Goodbye! 👋")
                sys.exit(0)
            else:
                print("Please enter 'y' or 'n'.")


def main():
    """Main function to run the game"""
    while True:
        try:
            game = TicTacToe()
            game.play_game()
        except KeyboardInterrupt:
            print("\n\nGame interrupted. Thanks for playing!")
            sys.exit(0)
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            print("Restarting game...\n")
            input("Press Enter to continue...")


if __name__ == "__main__":
    main()