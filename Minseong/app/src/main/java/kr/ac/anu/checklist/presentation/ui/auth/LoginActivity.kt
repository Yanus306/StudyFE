package kr.ac.anu.checklist.presentation.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import dagger.hilt.android.AndroidEntryPoint
import kr.ac.anu.checklist.databinding.ActivityLoginBinding
import kr.ac.anu.checklist.presentation.ui.main.MainActivity
import kr.ac.anu.checklist.presentation.viewmodel.auth.LoginState
import kr.ac.anu.checklist.presentation.viewmodel.auth.LoginViewModel

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding

    private val loginViewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initClickListener()
        observeLoginState()
    }

    private fun initClickListener() {
        binding.btnLogin.setOnClickListener {
            val id = binding.etId.text.toString().trim()
            val pw = binding.etPw.text.toString().trim()

            loginViewModel.login(
                id = id,
                pw = pw
            )
        }

        binding.btnJoin.setOnClickListener {
            val intent = Intent(this, JoinActivity::class.java)
            startActivity(intent)
        }
    }

    private fun observeLoginState() {
        loginViewModel.loginState.observe(this) { state ->
            when (state) {
                is LoginState.Idle -> Unit

                is LoginState.Loading -> {
                    binding.btnLogin.isEnabled = false
                    binding.btnLogin.text = "로그인 중..."
                }

                is LoginState.Success -> {
                    binding.btnLogin.isEnabled = true
                    binding.btnLogin.text = "로그인"

                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
                    finish()
                }

                is LoginState.Fail -> {
                    binding.btnLogin.isEnabled = true
                    binding.btnLogin.text = "로그인"

                    Toast.makeText(
                        this,
                        state.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }
}
