import 'dart:typed_data';

import 'package:flutter/material.dart';

class PlayerAvatar extends StatelessWidget {
  const PlayerAvatar({
    super.key,
    required this.emoji,
    this.photoBytes,
    this.radius = 32,
  });

  final String emoji;
  final Uint8List? photoBytes;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final hasPhoto = photoBytes != null;

    return CircleAvatar(
      radius: radius,
      backgroundColor: const Color(0xFFBFD9FF),
      backgroundImage: hasPhoto ? MemoryImage(photoBytes!) : null,
      child: hasPhoto
          ? null
          : Text(
              emoji,
              style: TextStyle(fontSize: radius),
            ),
    );
  }
}
