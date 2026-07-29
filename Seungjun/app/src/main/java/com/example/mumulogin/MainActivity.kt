package com.example.mumulogin

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.mumulogin.databinding.ActivityMainBinding
import kotlin.jvm.java

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        screen()
    }

    private fun screen() {
        binding.layoutMo.setOnClickListener {
            val intent = Intent(this, MoInfo::class.java)
            startActivity(intent)
        }
        binding.layoutAn.setOnClickListener {
            val intent = Intent(this, AdminAnimal::class.java)
            startActivity(intent)
        }
        binding.layoutMy1.setOnClickListener {
            val intent = Intent(this, AdminPfl1::class.java)
            startActivity(intent)
        }
        binding.layoutMy2.setOnClickListener {
            val intent = Intent(this, AdminSecPfl::class.java)
            startActivity(intent)
        }
    }
}