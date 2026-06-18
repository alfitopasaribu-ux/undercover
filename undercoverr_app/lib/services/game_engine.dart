import 'dart:math';

import '../data/local_words.dart';
import '../models/game_models.dart';
import 'api_service.dart';

class GameEngine {
  final Random random = Random();

  Future<GameData> createGame({
    required List<PlayerSetup> playerSetups,
    required int undercoverCount,
    required int mrWhiteCount,
  }) async {
    try {
      return await ApiService().createGame(
        playerSetups: playerSetups,
        undercoverCount: undercoverCount,
        mrWhiteCount: mrWhiteCount,
      );
    } catch (_) {
      return createLocalGame(
        playerSetups: playerSetups,
        undercoverCount: undercoverCount,
        mrWhiteCount: mrWhiteCount,
      );
    }
  }

  GameData createLocalGame({
    required List<PlayerSetup> playerSetups,
    required int undercoverCount,
    required int mrWhiteCount,
  }) {
    final pair = localWords[random.nextInt(localWords.length)];

    final rolePool = <PlayerRole>[
      ...List.filled(
        playerSetups.length - undercoverCount - mrWhiteCount,
        PlayerRole.civilian,
      ),
      ...List.filled(undercoverCount, PlayerRole.undercover),
      ...List.filled(mrWhiteCount, PlayerRole.mrWhite),
    ];

    rolePool.shuffle();

    final players = <Player>[];

    for (int i = 0; i < playerSetups.length; i++) {
      final role = rolePool[i];

      String? word;

      if (role == PlayerRole.civilian) {
        word = pair['civilian'];
      } else if (role == PlayerRole.undercover) {
        word = pair['undercover'];
      } else {
        word = null;
      }

      players.add(
        Player(
          name: playerSetups[i].name,
          avatarEmoji: playerSetups[i].avatarEmoji,
          photoBytes: playerSetups[i].photoBytes,
          role: role,
          word: word,
        ),
      );
    }

    return GameData(
      players: players,
      civilianWord: pair['civilian']!,
      undercoverWord: pair['undercover']!,
    );
  }
}
