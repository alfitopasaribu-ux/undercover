import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import 'player_setup_screen.dart';

class SetupScreen extends StatefulWidget {
  const SetupScreen({super.key});

  @override
  State<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen> {
  int playerCount = 5;
  int undercoverCount = 1;
  int mrWhiteCount = 1;

  int get civilianCount {
    return playerCount - undercoverCount - mrWhiteCount;
  }

  @override
  Widget build(BuildContext context) {
    if (undercoverCount + mrWhiteCount >= playerCount) {
      undercoverCount = 1;
      mrWhiteCount = 0;
    }

    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(22),
            children: [
              Row(
                children: [
                  IconButton.filled(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                  ),
                  const Spacer(),
                  TextButton.icon(
                    onPressed: showRule,
                    icon: const Icon(Icons.help),
                    label: const Text('Aturan'),
                  ),
                ],
              ),
              const SizedBox(height: 58),
              Text(
                'Pemain: $playerCount',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 8),
              Slider(
                value: playerCount.toDouble(),
                min: 3,
                max: 16,
                divisions: 13,
                activeColor: AppTheme.green,
                onChanged: (value) {
                  setState(() {
                    playerCount = value.round();
                  });
                },
              ),
              const SizedBox(height: 20),
              GlassCard(
                color: Colors.white.withValues(alpha: 0.78),
                child: Column(
                  children: [
                    roleInfo(
                      text: '$civilianCount Civilian',
                      color: AppTheme.blue,
                      textColor: Colors.white,
                    ),
                    roleCounter(
                      text: '$undercoverCount Undercover',
                      color: Colors.black,
                      textColor: Colors.white,
                      onMinus: undercoverCount > 0
                          ? () => setState(() => undercoverCount--)
                          : null,
                      onPlus: undercoverCount + mrWhiteCount < playerCount - 1
                          ? () => setState(() => undercoverCount++)
                          : null,
                    ),
                    roleCounter(
                      text: '$mrWhiteCount Mr. White',
                      color: Colors.white,
                      textColor: Colors.black,
                      onMinus: mrWhiteCount > 0
                          ? () => setState(() => mrWhiteCount--)
                          : null,
                      onPlus: undercoverCount + mrWhiteCount < playerCount - 1
                          ? () => setState(() => mrWhiteCount++)
                          : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),
              GlassCard(
                color: Colors.white.withValues(alpha: 0.75),
                child: const Column(
                  children: [
                    Text(
                      'Kata-kata',
                      style: TextStyle(
                        color: Colors.black54,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Standar Indonesia',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Kata akan diambil dari NeonDB jika backend aktif.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.black54,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              GlassCard(
                color: Colors.white.withValues(alpha: 0.16),
                child: const Row(
                  children: [
                    Text(
                      '🎭',
                      style: TextStyle(fontSize: 40),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Peran khusus akan kita tambahkan setelah mode utama Undercover stabil.',
                        style: TextStyle(
                          color: Colors.white70,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 42),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PlayerSetupScreen(
                        playerCount: playerCount,
                        undercoverCount: undercoverCount,
                        mrWhiteCount: mrWhiteCount,
                      ),
                    ),
                  );
                },
                child: const Text('Lanjut Isi Pemain'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget roleInfo({
    required String text,
    required Color color,
    required Color textColor,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.symmetric(
        vertical: 10,
        horizontal: 18,
      ),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontWeight: FontWeight.w900,
          fontSize: 16,
        ),
      ),
    );
  }

  Widget roleCounter({
    required String text,
    required Color color,
    required Color textColor,
    VoidCallback? onMinus,
    VoidCallback? onPlus,
  }) {
    return Row(
      children: [
        IconButton.filled(
          onPressed: onMinus,
          icon: const Icon(Icons.remove),
          style: IconButton.styleFrom(
            backgroundColor: Colors.black,
          ),
        ),
        Expanded(
          child: Center(
            child: roleInfo(
              text: text,
              color: color,
              textColor: textColor,
            ),
          ),
        ),
        IconButton.filled(
          onPressed: onPlus,
          icon: const Icon(Icons.add),
          style: IconButton.styleFrom(
            backgroundColor: Colors.black,
          ),
        ),
      ],
    );
  }

  void showRule() {
    showDialog(
      context: context,
      builder: (_) => const AlertDialog(
        backgroundColor: Colors.white,
        title: Text(
          'Aturan Singkat',
          style: TextStyle(color: Colors.black),
        ),
        content: Text(
          'Civilian mendapat kata yang sama. Undercover mendapat kata mirip tapi berbeda. Mr. White tidak mendapat kata. Pemain berdiskusi lalu voting untuk mencari Undercover.',
          style: TextStyle(color: Colors.black87),
        ),
      ),
    );
  }
}
