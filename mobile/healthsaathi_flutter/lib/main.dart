import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  runApp(const HealthSaathiApp());
}

class HealthSaathiApp extends StatelessWidget {
  const HealthSaathiApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HealthSaathi',
      theme: ThemeData(primarySwatch: Colors.teal),
      home: const HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String status = 'Idle';

  Future<void> checkHealth() async {
    final base = dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:8000/api';
    setState(() { status = 'Checking $base/health...'; });
    try {
      final res = await http.get(Uri.parse('$base/health'));
      setState(() { status = 'Health ${res.statusCode}: ${res.body}'; });
    } catch (e) {
      setState(() { status = 'Error: $e'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('HealthSaathi (Mobile)')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(status),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: checkHealth,
              child: const Text('Check Backend Health'),
            ),
          ],
        ),
      ),
    );
  }
}
