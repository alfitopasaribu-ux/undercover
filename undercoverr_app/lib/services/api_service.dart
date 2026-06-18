import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/game_models.dart';

const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

class ApiService {
  Future<GameData> createGame({
    required List<PlayerSetup> playerSetups,
    required int undercoverCount,
    required int mrWhiteCount,
  }) async {
    final url = Uri.parse('$apiBaseUrl/api/games');

    final response = await http
        .post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'players': playerSetups
                .map(
                  (p) => {
                    'name': p.name,
                    'avatarEmoji': p.avatarEmoji,
                    'photoUrl': null,
                  },
                )
                .toList(),
            'undercoverCount': undercoverCount,
            'mrWhiteCount': mrWhiteCount,
            'lang': 'id',
            'pack': 'standard',
          }),
        )
        .timeout(const Duration(seconds: 6));

    if (response.statusCode != 201) {
      throw Exception(response.body);
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final assignments = body['assignments'] as List<dynamic>;

    final players = <Player>[];

    for (int i = 0; i < assignments.length; i++) {
      final item = assignments[i] as Map<String, dynamic>;

      players.add(
        Player(
          name: item['playerName'] as String,
          role: PlayerRoleExt.fromApi(item['role'] as String),
          word: item['word'] as String?,
          avatarEmoji: playerSetups[i].avatarEmoji,
          photoBytes: playerSetups[i].photoBytes,
        ),
      );
    }

    return GameData(
      gameId: body['id'] as String,
      players: players,
      civilianWord: body['civilianWord'] as String,
      undercoverWord: body['undercoverWord'] as String,
    );
  }

  Future<void> finishGame({
    required String gameId,
    required WinnerSide winner,
  }) async {
    final url = Uri.parse('$apiBaseUrl/api/games/$gameId/finish');

    final winnerText = switch (winner) {
      WinnerSide.civilian => 'CIVILIANS',
      WinnerSide.undercover => 'UNDERCOVER',
      WinnerSide.mrWhite => 'MR_WHITE',
      WinnerSide.unknown => 'UNKNOWN',
    };

    await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'winner': winnerText}),
    );
  }
}
