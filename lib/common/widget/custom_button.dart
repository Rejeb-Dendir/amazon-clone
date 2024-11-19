import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  final Color? color;
  const CustomButton(
      {super.key, required this.text, required this.onTap, this.color});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(double.infinity, 50),
        backgroundColor: color == null
            ? const Color.fromARGB(255, 248, 171, 3)
            : const Color.fromARGB(255, 229, 240, 74),
        foregroundColor: color == null ? Colors.white : Colors.black,
      ),
      child: Text(
        text,
      ),
    );
  }
}
