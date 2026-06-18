import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/player_avatar.dart';
import 'play_screen.dart';

class CardRevealScreen extends StatefulWidget {
  const CardRevealScreen({
    super.key,
    required this.game,
  });

  final GameData game;

  @override
  State<CardRevealScreen> createState() => _CardRevealScreenState();
}

class _CardRevealScreenState extends State<CardRevealScreen> {
  int index = 0;
  bool opened = false;

  @override
  Widget build(BuildContext context) {
    final player = widget.game.players[index];
    final isLast = index == widget.game.players.length - 1;

    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              children: [
                LinearProgressIndicator(
                  value: (index + (opened ? 1 : 0)) /
                      widget.game.players.length,
                  minHeight: 10,
                  borderRadius: BorderRadius.circular(20),
                  color: AppTheme.green,
                  backgroundColor: Colors.white.withValues(alpha: 0.18),
                ),
                const SizedBox(height: 20),
                Text(
                  opened ? player.name : 'Giliran ${player.name}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 29,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Tekan kartu untuk melihat role dan kata rahasia.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white70,
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () {
                    if (!opened) {
                      setState(() => opened = true);
                    }
                  },
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    child: opened
                        ? OpenCard(player: player)
                        : ClosedCard(player: player),
                  ),
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () {
                    if (!opened) {
                      setState(() => opened = true);
                      return;
                    }

                    if (isLast) {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PlayScreen(game: widget.game),
                        ),
                      );
                    } else {
                      setState(() {
                        index++;
                        opened = false;
                      });
                    }
                  },
                  child: Text(
                    opened
                        ? isLast
                            ? 'Mulai Diskusi'
                            : 'Tutup & Lanjut'
                        : 'Buka Kartu',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ClosedCard extends StatelessWidget {
  const ClosedCard({
    super.key,
    required this.player,
  });

  final Player player;

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      key: const ValueKey('closed'),
      color: Colors.white.withValues(alpha: 0.93),
      padding: const EdgeInsets.all(24),
      child: SizedBox(
        height: 430,
        width: double.infinity,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            PlayerAvatar(
              emoji: player.avatarEmoji,
              photoBytes: player.photoBytes,
              radius: 48,
            ),
            const SizedBox(height: 22),
            const Icon(
              Icons.style,
              size: 90,
              color: AppTheme.blue,
            ),
            const SizedBox(height: 18),
            const Text(
              'KARTU RAHASIA',
              style: TextStyle(
                color: Colors.black,
                fontSize: 30,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Tap untuk buka kartu',
              style: TextStyle(
                color: Colors.black54,
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class OpenCard extends StatelessWidget {
  const OpenCard({
    super.key,
    required this.player,
  });

  final Player player;

  @override
  Widget build(BuildContext context) {
    final description = switch (player.role) {
      PlayerRole.civilian =>
        'Semua Civilian akan menerima kata yang sama.',
      PlayerRole.undercover =>
        'Undercover akan menerima kata yang berbeda dari yang lain.',
      PlayerRole.mrWhite =>
        'Mr. White tidak akan menerima sepatah kata pun.',
    };

    return GlassCard(
      key: const ValueKey('open'),
      color: Colors.white.withValues(alpha: 0.96),
      padding: const EdgeInsets.all(24),
      child: SizedBox(
        height: 430,
        width: double.infinity,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 185,
              height: 185,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.grey.shade200,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.18),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: ClipOval(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Image.asset(
                    player.role.roleImageAsset,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 22),
            Text(
              player.role.label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.black,
                fontSize: 28,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              description,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.black87,
                fontSize: 17,
                height: 1.35,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (player.word != null) ...[
              const SizedBox(height: 22),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 13,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.blue,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  player.word!,
                  style: const TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
