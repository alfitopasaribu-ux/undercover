import 'dart:ui';

import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../widgets/player_avatar.dart';

class EliminationResultScreen extends StatefulWidget {
  const EliminationResultScreen({
    super.key,
    required this.player,
  });

  final Player player;

  @override
  State<EliminationResultScreen> createState() =>
      _EliminationResultScreenState();
}

class _EliminationResultScreenState extends State<EliminationResultScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  late final Animation<double> fadeAnimation;
  late final Animation<double> scaleAnimation;
  late final Animation<Offset> slideAnimation;

  bool get isCivilian => widget.player.role == PlayerRole.civilian;
  bool get isUndercover => widget.player.role == PlayerRole.undercover;
  bool get isMrWhite => widget.player.role == PlayerRole.mrWhite;

  String get title {
    if (isCivilian) return 'Civilian Tersingkir';
    if (isUndercover) return 'Undercover Tertangkap!';
    if (isMrWhite) return 'Mr. White Tersingkir';
    return 'Pemain Tersingkir';
  }

  String get headline {
    if (isCivilian) return 'Anda telah menebak Civilian';
    if (isUndercover) return 'Tebakanmu benar, ini Undercover!';
    if (isMrWhite) return 'Dia adalah Mr. White';
    return 'Pemain telah tereliminasi';
  }

  String get description {
    if (isCivilian) {
      return 'Tebakan belum tepat. Undercover masih berkeliaran dan permainan berlanjut ke ronde berikutnya.';
    }

    if (isUndercover) {
      return 'Bagus! Undercover berhasil ditemukan. Civilian semakin dekat menuju kemenangan.';
    }

    if (isMrWhite) {
      return 'Mr. White keluar dari permainan. Tetap waspada, Undercover mungkin masih hidup.';
    }

    return 'Permainan berlanjut.';
  }

  Color get accentColor {
    if (isCivilian) return const Color(0xFFFF7A59);
    if (isUndercover) return const Color(0xFF3FE17F);
    if (isMrWhite) return const Color(0xFF4DA3FF);
    return Colors.white;
  }

  IconData get icon {
    if (isCivilian) return Icons.warning_rounded;
    if (isUndercover) return Icons.verified_rounded;
    if (isMrWhite) return Icons.visibility_off_rounded;
    return Icons.info_rounded;
  }

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 850),
    );

    fadeAnimation = CurvedAnimation(
      parent: controller,
      curve: Curves.easeOut,
    );

    scaleAnimation = Tween<double>(
      begin: 0.82,
      end: 1.0,
    ).animate(
      CurvedAnimation(
        parent: controller,
        curve: Curves.elasticOut,
      ),
    );

    slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.12),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: controller,
        curve: Curves.easeOutCubic,
      ),
    );

    controller.forward();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withValues(alpha: 0.68),
      body: Stack(
        children: [
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
              child: const SizedBox.expand(),
            ),
          ),
          SafeArea(
            child: Center(
              child: FadeTransition(
                opacity: fadeAnimation,
                child: SlideTransition(
                  position: slideAnimation,
                  child: ScaleTransition(
                    scale: scaleAnimation,
                    child: Container(
                      width: 390,
                      margin: const EdgeInsets.symmetric(horizontal: 22),
                      padding: const EdgeInsets.fromLTRB(24, 24, 24, 22),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF20234A),
                            Color(0xFF111426),
                          ],
                        ),
                        border: Border.all(
                          color: accentColor.withValues(alpha: 0.48),
                          width: 1.4,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: accentColor.withValues(alpha: 0.24),
                            blurRadius: 26,
                            spreadRadius: 3,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircleAvatar(
                            radius: 34,
                            backgroundColor:
                                accentColor.withValues(alpha: 0.15),
                            child: Icon(
                              icon,
                              color: accentColor,
                              size: 38,
                            ),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            title,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Container(
                            padding: const EdgeInsets.all(9),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: accentColor.withValues(alpha: 0.52),
                                width: 3,
                              ),
                            ),
                            child: PlayerAvatar(
                              emoji: widget.player.avatarEmoji,
                              photoBytes: widget.player.photoBytes,
                              radius: 58,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            widget.player.name,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 21,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(height: 18),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: accentColor.withValues(alpha: 0.14),
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Text(
                              headline,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: accentColor,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            description,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.88),
                              fontSize: 15,
                              height: 1.45,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () => Navigator.pop(context),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: accentColor,
                                foregroundColor: Colors.white,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                              ),
                              child: const Text(
                                'Lanjut',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
