import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../services/game_engine.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/player_avatar.dart';
import 'card_reveal_screen.dart';
import 'home_screen.dart';

class ResultScreen extends StatefulWidget {
  const ResultScreen({
    super.key,
    required this.game,
    required this.winner,
  });

  final GameData game;
  final WinnerSide winner;

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  bool loadingNextRound = false;

  int get undercoverCount {
    return widget.game.players
        .where((p) => p.role == PlayerRole.undercover)
        .length;
  }

  int get mrWhiteCount {
    return widget.game.players.where((p) => p.role == PlayerRole.mrWhite).length;
  }

  String get title {
    return switch (widget.winner) {
      WinnerSide.civilian => 'Civilian Menang!',
      WinnerSide.undercover => 'Undercover Menang!',
      WinnerSide.mrWhite => 'Mr. White & Undercover Menang!',
      WinnerSide.unknown => 'Game Selesai',
    };
  }

  String get subtitle {
    return switch (widget.winner) {
      WinnerSide.civilian =>
        'Civilian berhasil menemukan semua penyusup. Semua Civilian mendapat +10 poin.',
      WinnerSide.undercover =>
        'Undercover berhasil bertahan sampai akhir. Semua Undercover mendapat +10 poin.',
      WinnerSide.mrWhite =>
        'Mr. White berhasil menebak kata Civilian. Mr. White dan Undercover mendapat +10 poin.',
      WinnerSide.unknown => 'Permainan telah selesai.',
    };
  }

  Future<void> startNextRound() async {
    if (loadingNextRound) return;

    setState(() {
      loadingNextRound = true;
    });

    final setups = widget.game.players.map((p) {
      return PlayerSetup(
        name: p.name,
        avatarEmoji: p.avatarEmoji,
        photoBytes: p.photoBytes,
      );
    }).toList();

    final newGame = await GameEngine().createGame(
      playerSetups: setups,
      undercoverCount: undercoverCount,
      mrWhiteCount: mrWhiteCount,
    );

    for (int i = 0; i < newGame.players.length; i++) {
      newGame.players[i].points = widget.game.players[i].points;
    }

    if (!mounted) return;

    setState(() {
      loadingNextRound = false;
    });

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => CardRevealScreen(game: newGame),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              children: [
                Expanded(
                  child: GlassCard(
                    color: Colors.white.withValues(alpha: 0.93),
                    child: Column(
                      children: [
                        winnerImage(),
                        const SizedBox(height: 10),
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
                                'Kata Civilian: ${widget.game.civilianWord}',
                                style: const TextStyle(
                                  color: Colors.black87,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              Text(
                                'Kata Undercover: ${widget.game.undercoverWord}',
                                style: const TextStyle(
                                  color: Colors.black87,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Expanded(
                          child: ListView(
                            children: [
                              for (final p in widget.game.players)
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
                                      '${p.points} poin',
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
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: loadingNextRound ? null : startNextRound,
                  child: loadingNextRound
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Lanjut Ronde Berikutnya'),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const HomeScreen(),
                      ),
                      (_) => false,
                    );
                  },
                  child: const Text('Kembali ke Menu Awal'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget winnerImage() {
    if (widget.winner == WinnerSide.mrWhite) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          roleCircle('assets/roles/mr_white.png'),
          const SizedBox(width: 14),
          roleCircle('assets/roles/undercover.png'),
        ],
      );
    }

    if (widget.winner == WinnerSide.undercover) {
      return roleCircle('assets/roles/undercover.png');
    }

    if (widget.winner == WinnerSide.civilian) {
      return roleCircle('assets/roles/civilian.png');
    }

    return const Icon(
      Icons.help,
      color: Colors.black,
      size: 72,
    );
  }

  Widget roleCircle(String assetPath) {
    return Container(
      width: 96,
      height: 96,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.grey.shade200,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.16),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipOval(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Image.asset(
            assetPath,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
