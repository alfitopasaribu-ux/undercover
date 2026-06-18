import 'dart:math';

import 'package:flutter/material.dart';

class AppBackground extends StatelessWidget {
  const AppBackground({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF070725),
                  Color(0xFF1A1045),
                  Color(0xFF0B777F),
                  Color(0xFF070827),
                ],
              ),
            ),
          ),
        ),
        Positioned.fill(
          child: CustomPaint(
            painter: StarsPainter(),
          ),
        ),
        Positioned(
          bottom: 70,
          left: 0,
          right: 0,
          child: SizedBox(
            height: 230,
            child: CustomPaint(
              painter: MountainPainter(),
            ),
          ),
        ),
        child,
      ],
    );
  }
}

class StarsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final random = Random(7);
    final paint = Paint()..color = Colors.white.withValues(alpha: 0.42);

    for (int i = 0; i < 90; i++) {
      canvas.drawCircle(
        Offset(
          random.nextDouble() * size.width,
          random.nextDouble() * size.height * 0.55,
        ),
        random.nextDouble() * 1.4,
        paint,
      );
    }

    canvas.drawCircle(
      Offset(size.width + 20, size.height * 0.25),
      55,
      Paint()..color = Colors.deepOrangeAccent.withValues(alpha: 0.8),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MountainPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final baseY = size.height;

    final points = [
      Offset(-20, baseY),
      Offset(size.width * 0.10, size.height * 0.70),
      Offset(size.width * 0.25, size.height * 0.38),
      Offset(size.width * 0.42, size.height * 0.64),
      Offset(size.width * 0.55, size.height * 0.32),
      Offset(size.width * 0.70, size.height * 0.62),
      Offset(size.width * 0.85, size.height * 0.45),
      Offset(size.width + 20, size.height * 0.68),
      Offset(size.width + 20, baseY),
    ];

    final path = Path()..moveTo(points.first.dx, points.first.dy);

    for (final point in points.skip(1)) {
      path.lineTo(point.dx, point.dy);
    }

    path.close();

    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0xFF142061),
          Color(0xFF05071E),
        ],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(
        Rect.fromLTWH(0, 0, size.width, size.height),
      );

    canvas.drawPath(path, paint);

    final linePaint = Paint()
      ..color = const Color(0xFF26E5DE).withValues(alpha: 0.16)
      ..strokeWidth = 1;

    for (int i = 1; i < points.length - 2; i++) {
      canvas.drawLine(
        points[i],
        Offset(points[i].dx, baseY),
        linePaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
