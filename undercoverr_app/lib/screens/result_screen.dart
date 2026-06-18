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
      WinnerSide.mrWhite => 'Mr. White & Undercover Menang!',
      WinnerSide.unknown => 'Game Selesai',
    };

    final subtitle = switch (winner) {
      WinnerSide.civilian =>
        'Civilian berhasil menemukan semua penyusup.',
      WinnerSide.undercover =>
        'Undercover berhasil bertahan sampai akhir.',
      WinnerSide.mrWhite =>
        'Mr. White berhasil menebak kata Civilian. Mr. White dan Undercover mendapat poin.',
      WinnerSide.unknown => 'Permainan telah selesai.',
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
                        '??',
                        style: TextStyle(fontSize: 70),
                      ),
                      Text(
                        title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 29,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        subtitle,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.black54,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.blue.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
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
                          ],
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
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: p.points > 0
                                  ? AppTheme.green.withValues(alpha: 0.18)
                                  : Colors.black.withValues(alpha: 0.06),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              '+${p.points} poin',
                              style: TextStyle(
                                color: p.points > 0
                                    ? Colors.green.shade800
                                    : Colors.black45,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
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
