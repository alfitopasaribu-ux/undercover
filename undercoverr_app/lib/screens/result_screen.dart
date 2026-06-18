import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/player_avatar.dart';
import 'home_screen.dart';

class ResultScreen extends StatelessWidget {
  const ResultScreen({
    super.key,
    required this.game,
    required this.winner,
  });

  final GameData game;
  final WinnerSide winner;

  @override
  Widget build(BuildContext context) {
    final title = switch (winner) {
      WinnerSide.civilian => 'Civilian Menang!',
      WinnerSide.undercover => 'Undercover Menang!',
      WinnerSide.mrWhite => 'Mr. White Menang!',
      WinnerSide.unknown => 'Game Selesai',
    };

    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              children: [
                const Spacer(),
                GlassCard(
                  color: Colors.white.withValues(alpha: 0.92),
                  child: Column(
                    children: [
                      const Text(
                        '🏆',
                        style: TextStyle(fontSize: 78),
                      ),
                      Text(
                        title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 30,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Kata Civilian: ${game.civilianWord}',
                        style: const TextStyle(
                          color: Colors.black87,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      Text(
                        'Kata Undercover: ${game.undercoverWord}',
                        style: const TextStyle(
                          color: Colors.black87,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 16),
                      for (final p in game.players)
                        ListTile(
                          dense: true,
                          leading: PlayerAvatar(
                            emoji: p.avatarEmoji,
                            photoBytes: p.photoBytes,
                            radius: 20,
                          ),
                          title: Text(
                            p.name,
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          subtitle: Text(
                            '${p.role.label} • ${p.word ?? "-"}',
                            style: const TextStyle(
                              color: Colors.black54,
                            ),
                          ),
                          trailing: Icon(
                            p.isAlive ? Icons.favorite : Icons.close,
                            color: p.isAlive ? AppTheme.green : Colors.red,
                          ),
                        ),
                    ],
                  ),
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const HomeScreen(),
                      ),
                      (_) => false,
                    );
                  },
                  child: const Text('Main Lagi'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
