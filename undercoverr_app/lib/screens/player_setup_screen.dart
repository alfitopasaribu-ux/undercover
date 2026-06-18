import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../models/game_models.dart';
import '../services/game_engine.dart';
import '../theme/app_theme.dart';
import '../widgets/app_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/player_avatar.dart';
import 'card_reveal_screen.dart';

class PlayerSetupScreen extends StatefulWidget {
  const PlayerSetupScreen({
    super.key,
    required this.playerCount,
    required this.undercoverCount,
    required this.mrWhiteCount,
  });

  final int playerCount;
  final int undercoverCount;
  final int mrWhiteCount;

  @override
  State<PlayerSetupScreen> createState() => _PlayerSetupScreenState();
}

class _PlayerSetupScreenState extends State<PlayerSetupScreen> {
  final ImagePicker picker = ImagePicker();

  late List<PlayerSetup> players;
  late List<TextEditingController> controllers;

  bool loading = false;

  final List<String> defaultEmojis = [
    '🙂',
    '😎',
    '🤠',
    '👩',
    '🧑',
    '🕵️',
    '🤖',
    '🐱',
    '🐶',
    '🦊',
    '🐼',
    '🦁',
    '🐯',
    '🐵',
    '🐸',
    '🐺',
  ];

  @override
  void initState() {
    super.initState();

    players = List.generate(
      widget.playerCount,
      (index) => PlayerSetup(
        name: 'Pemain ${index + 1}',
        avatarEmoji: defaultEmojis[index % defaultEmojis.length],
      ),
    );

    controllers = List.generate(
      widget.playerCount,
      (index) => TextEditingController(
        text: players[index].name,
      ),
    );
  }

  @override
  void dispose() {
    for (final item in controllers) {
      item.dispose();
    }
    super.dispose();
  }

  Future<void> pickFromGallery(int index) async {
    try {
      final image = await picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 75,
        maxWidth: 900,
      );

      if (image == null) return;

      final bytes = await image.readAsBytes();

      setState(() {
        players[index].photoBytes = bytes;
      });
    } catch (error) {
      showMessage('Gagal mengambil gambar dari galeri.');
    }
  }

  Future<void> takeFromCamera(int index) async {
    try {
      final image = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 75,
        maxWidth: 900,
        preferredCameraDevice: CameraDevice.front,
      );

      if (image == null) return;

      final bytes = await image.readAsBytes();

      setState(() {
        players[index].photoBytes = bytes;
      });
    } catch (error) {
      showMessage(
        'Kamera belum bisa dibuka di device ini. Coba jalankan di Android/HP asli.',
      );
    }
  }

  void changeEmoji(int index) {
    final current = defaultEmojis.indexOf(players[index].avatarEmoji);
    final next = (current + 1) % defaultEmojis.length;

    setState(() {
      players[index].avatarEmoji = defaultEmojis[next];
      players[index].photoBytes = null;
    });
  }

  void removePhoto(int index) {
    setState(() {
      players[index].photoBytes = null;
    });
  }

  void showAvatarOptions(int index) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF181A32),
      showDragHandle: true,
      builder: (_) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(22, 8, 22, 22),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Foto ${controllers[index].text}',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 14),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppTheme.blue,
                    child: Icon(Icons.photo_library, color: Colors.white),
                  ),
                  title: const Text('Pilih dari Galeri'),
                  subtitle: const Text('Ambil foto dari file/galeri HP'),
                  onTap: () {
                    Navigator.pop(context);
                    pickFromGallery(index);
                  },
                ),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppTheme.green,
                    child: Icon(Icons.camera_alt, color: Colors.white),
                  ),
                  title: const Text('Ambil Foto Kamera'),
                  subtitle: const Text('Gunakan kamera depan HP'),
                  onTap: () {
                    Navigator.pop(context);
                    takeFromCamera(index);
                  },
                ),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppTheme.pink,
                    child: Icon(Icons.face, color: Colors.white),
                  ),
                  title: const Text('Pakai Avatar Default'),
                  subtitle: const Text('Ganti ke ikon karakter sementara'),
                  onTap: () {
                    Navigator.pop(context);
                    changeEmoji(index);
                  },
                ),
                if (players[index].photoBytes != null)
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Colors.red,
                      child: Icon(Icons.delete, color: Colors.white),
                    ),
                    title: const Text('Hapus Foto'),
                    subtitle: const Text('Kembalikan ke avatar default'),
                    onTap: () {
                      Navigator.pop(context);
                      removePhoto(index);
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> startGame() async {
    for (int i = 0; i < players.length; i++) {
      players[i].name = controllers[i].text.trim();
    }

    if (players.any((p) => p.name.isEmpty)) {
      showMessage('Semua nama pemain wajib diisi.');
      return;
    }

    setState(() => loading = true);

    final game = await GameEngine().createGame(
      playerSetups: players,
      undercoverCount: widget.undercoverCount,
      mrWhiteCount: widget.mrWhiteCount,
    );

    if (!mounted) return;

    setState(() => loading = false);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => CardRevealScreen(game: game),
      ),
    );
  }

  void showMessage(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Isi Nama & Foto',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Tap foto/avatar pemain untuk pilih dari galeri, ambil kamera, atau pakai avatar default.',
                style: TextStyle(
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 18),
              GlassCard(
                child: Column(
                  children: [
                    for (int i = 0; i < players.length; i++)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () => showAvatarOptions(i),
                              child: Stack(
                                children: [
                                  PlayerAvatar(
                                    emoji: players[i].avatarEmoji,
                                    photoBytes: players[i].photoBytes,
                                    radius: 36,
                                  ),
                                  const Positioned(
                                    right: 0,
                                    bottom: 0,
                                    child: CircleAvatar(
                                      radius: 13,
                                      backgroundColor: AppTheme.blue,
                                      child: Icon(
                                        Icons.camera_alt,
                                        size: 14,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                controller: controllers[i],
                                textInputAction: TextInputAction.next,
                                decoration: InputDecoration(
                                  labelText: 'Nama Pemain ${i + 1}',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 26),
              ElevatedButton(
                onPressed: loading ? null : startGame,
                child: loading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Buat Kartu Rahasia'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}