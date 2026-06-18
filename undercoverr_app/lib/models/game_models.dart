import 'dart:typed_data';

enum PlayerRole {
  civilian,
  undercover,
  mrWhite,
}

enum WinnerSide {
  civilian,
  undercover,
  mrWhite,
  unknown,
}

extension PlayerRoleExt on PlayerRole {
  String get label {
    switch (this) {
      case PlayerRole.civilian:
        return 'Civilian';
      case PlayerRole.undercover:
        return 'Undercover';
      case PlayerRole.mrWhite:
        return 'Mr. White';
    }
  }

  String get roleImageAsset {
    switch (this) {
      case PlayerRole.civilian:
        return 'assets/roles/civilian.png';
      case PlayerRole.undercover:
        return 'assets/roles/undercover.png';
      case PlayerRole.mrWhite:
        return 'assets/roles/mr_white.png';
    }
  }

  static PlayerRole fromApi(String value) {
    switch (value.toUpperCase()) {
      case 'UNDERCOVER':
        return PlayerRole.undercover;
      case 'MR_WHITE':
        return PlayerRole.mrWhite;
      default:
        return PlayerRole.civilian;
    }
  }
}

class PlayerSetup {
  PlayerSetup({
    required this.name,
    required this.avatarEmoji,
    this.photoBytes,
  });

  String name;
  String avatarEmoji;
  Uint8List? photoBytes;
}

class Player {
  Player({
    required this.name,
    required this.role,
    required this.avatarEmoji,
    this.photoBytes,
    this.word,
    this.isAlive = true,
    this.points = 0,
  });

  String name;
  PlayerRole role;
  String avatarEmoji;
  Uint8List? photoBytes;
  String? word;
  bool isAlive;
  int points;
}

class GameData {
  GameData({
    required this.players,
    required this.civilianWord,
    required this.undercoverWord,
    this.gameId,
  });

  String? gameId;
  List<Player> players;
  String civilianWord;
  String undercoverWord;

  int get aliveCivilian {
    return players
        .where((p) => p.isAlive && p.role == PlayerRole.civilian)
        .length;
  }

  int get aliveUndercover {
    return players
        .where((p) => p.isAlive && p.role == PlayerRole.undercover)
        .length;
  }

  int get aliveMrWhite {
    return players
        .where((p) => p.isAlive && p.role == PlayerRole.mrWhite)
        .length;
  }

  int get aliveTotal {
    return players.where((p) => p.isAlive).length;
  }

  WinnerSide checkWinner() {
    if (aliveUndercover == 0 && aliveMrWhite == 0) {
      return WinnerSide.civilian;
    }

    if (aliveUndercover > 0 && aliveUndercover >= aliveCivilian) {
      return WinnerSide.undercover;
    }

    return WinnerSide.unknown;
  }
}
