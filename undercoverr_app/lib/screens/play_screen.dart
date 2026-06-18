import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/player_avatar.dart';
import 'elimination_result_screen.dart';
import 'result_screen.dart';

class PlayScreen extends StatefulWidget {
  const PlayScreen({
    super.key,
    required this.game,
  });

  final GameData game;

  @override
  State<PlayScreen> createState() => _PlayScreenState();
}

class _PlayScreenState extends State<PlayScreen> {
  int round = 1;
  bool alreadyFinishing = false;
  bool pointsAwarded = false;

  int addTenPoint(int currentPoint) {
    final newPoint = currentPoint + 10;
    if (newPoint > 10000) {
      return 10000;
    }
    return newPoint;
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
                Text(
                  'Ronde $round',
                  style: const TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    children: [
                      const Text(
                        'Diskusi Dimulai!',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Jelaskan kata kamu tanpa menyebut kata langsung. Setelah itu voting siapa yang paling mencurigakan.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 18),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          infoBox('Civilian', '${widget.game.aliveCivilian}'),
                          infoBox('Undercover', '${widget.game.aliveUndercover}'),
                          infoBox('Mr. White', '${widget.game.aliveMrWhite}'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Pemain',
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: ListView.separated(
                    itemCount: widget.game.players.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final p = widget.game.players[index];

                      return ListTile(
                        tileColor: p.isAlive
                            ? Colors.white.withValues(alpha: 0.11)
                            : Colors.red.withValues(alpha: 0.18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        leading: PlayerAvatar(
                          emoji: p.avatarEmoji,
                          photoBytes: p.photoBytes,
                          radius: 24,
                        ),
                        title: Text(
                          p.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        subtitle: Text(
                          p.isAlive
                              ? 'Masih bermain • ${p.points} poin'
                              : 'Tereleminasi • ${p.points} poin',
                        ),
                        trailing: p.isAlive
                            ? const Icon(
                                Icons.circle,
                                size: 14,
                                color: AppTheme.green,
                              )
                            : const Icon(Icons.close),
                      );
                    },
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: alreadyFinishing ? null : openVoting,
                  icon: const Icon(Icons.how_to_vote),
                  label: const Text('Voting / Eliminasi'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget infoBox(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 25,
            fontWeight: FontWeight.w900,
            color: AppTheme.cyan,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white60,
          ),
        ),
      ],
    );
  }

  void openVoting() {
    final alivePlayers = widget.game.players.where((p) => p.isAlive).toList();

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF181A32),
      showDragHandle: true,
      builder: (_) {
        return ListView(
          padding: const EdgeInsets.all(22),
          children: [
            const Text(
              'Pilih pemain yang dieliminasi',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 14),
            for (final p in alivePlayers)
              ListTile(
                leading: PlayerAvatar(
                  emoji: p.avatarEmoji,
                  photoBytes: p.photoBytes,
                  radius: 24,
                ),
                title: Text(p.name),
                subtitle: const Text('Tap untuk eliminasi'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  Navigator.pop(context);
                  eliminatePlayer(p);
                },
              ),
          ],
        );
      },
    );
  }

  Future<void> eliminatePlayer(Player player) async {
    if (alreadyFinishing) return;

    if (player.role == PlayerRole.mrWhite) {
      await askMrWhiteGuess(player);
      return;
    }

    setState(() {
      player.isAlive = false;
    });

    await showEliminationAnimation(player);

    if (!mounted) return;

    final winner = widget.game.checkWinner();

    if (winner != WinnerSide.unknown) {
      await finishGame(winner);
      return;
    }

    setState(() {
      round++;
    });
  }

  Future<void> askMrWhiteGuess(Player player) async {
    final controller = TextEditingController();

    final guessedCorrectly = await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder: (_) {
            return AlertDialog(
              backgroundColor: Colors.white,
              title: const Text(
                'Mr. White Tereliminasi',
                style: TextStyle(color: Colors.black),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Mr. White punya satu kesempatan menebak kata Civilian.',
                    style: TextStyle(color: Colors.black87),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: controller,
                    decoration: const InputDecoration(
                      labelText: 'Tebak kata Civilian',
                      hintText: 'Contoh: Susu',
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: const Text('Lewati'),
                ),
                FilledButton(
                  onPressed: () {
                    final guess = controller.text.trim().toLowerCase();
                    final answer = widget.game.civilianWord.trim().toLowerCase();

                    Navigator.pop(context, guess == answer);
                  },
                  child: const Text('Kirim'),
                ),
              ],
            );
          },
        ) ??
        false;

    controller.dispose();

    if (!mounted) return;

    setState(() {
      player.isAlive = false;
    });

    if (guessedCorrectly) {
      await finishGame(WinnerSide.mrWhite);
      return;
    }

    await showEliminationAnimation(player);

    if (!mounted) return;

    final winner = widget.game.checkWinner();

    if (winner != WinnerSide.unknown) {
      await finishGame(winner);
      return;
    }

    setState(() {
      round++;
    });
  }

  Future<void> showEliminationAnimation(Player player) async {
    await Navigator.of(context).push(
      PageRouteBuilder<void>(
        opaque: false,
        pageBuilder: (_, __, ___) {
          return EliminationResultScreen(player: player);
        },
        transitionsBuilder: (_, animation, __, child) {
          return FadeTransition(
            opacity: CurvedAnimation(
              parent: animation,
              curve: Curves.easeOut,
            ),
            child: child,
          );
        },
      ),
    );
  }

  void awardPoints(WinnerSide winner) {
    if (pointsAwarded) return;

    for (final player in widget.game.players) {
      if (winner == WinnerSide.civilian &&
          player.role == PlayerRole.civilian) {
        player.points = addTenPoint(player.points);
      }

      if (winner == WinnerSide.undercover &&
          player.role == PlayerRole.undercover) {
        player.points = addTenPoint(player.points);
      }

      if (winner == WinnerSide.mrWhite &&
          (player.role == PlayerRole.mrWhite ||
              player.role == PlayerRole.undercover)) {
        player.points = addTenPoint(player.points);
      }
    }

    pointsAwarded = true;
  }

  Future<void> finishGame(WinnerSide winner) async {
    if (alreadyFinishing) return;

    setState(() {
      alreadyFinishing = true;
      awardPoints(winner);
    });

    if (widget.game.gameId != null) {
      try {
        await ApiService().finishGame(
          gameId: widget.game.gameId!,
          winner: winner,
        );
      } catch (_) {}
    }

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => ResultScreen(
          game: widget.game,
          winner: winner,
        ),
      ),
    );
  }
}
