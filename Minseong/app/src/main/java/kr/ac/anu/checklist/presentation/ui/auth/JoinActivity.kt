package kr.ac.anu.checklist.presentation.ui.auth

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import dagger.hilt.android.AndroidEntryPoint
import kr.ac.anu.checklist.databinding.ActivityJoinBinding
import kr.ac.anu.checklist.presentation.viewmodel.auth.JoinState
import kr.ac.anu.checklist.presentation.viewmodel.auth.JoinViewModel

@AndroidEntryPoint
class JoinActivity : AppCompatActivity() {
    private lateinit var binding: ActivityJoinBinding

    private val joinViewModel: JoinViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityJoinBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initClickListener()
        observeJoinState()
    }

    private fun initClickListener() {
        binding.btnJoin.setOnClickListener {
            val id = binding.etId.text.toString().trim()
            val pw = binding.etPw.text.toString().trim()
            val name = binding.etName.text.toString().trim()
            val affiliation = binding.etCompany.text.toString().trim()
            val position = binding.etPosition.text.toString().trim()

            joinViewModel.register(
                id = id,
                pw = pw,
                name = name,
                affiliation = affiliation,
                position = position
            )
        }
    }

    private fun observeJoinState() {
        joinViewModel.joinState.observe(this) { state ->
            when (state) {
                is JoinState.Idle -> Unit

                is JoinState.Loading -> {
                    binding.btnJoin.isEnabled = false
                    binding.btnJoin.text = "가입 중..."
                }

                is JoinState.Success -> {
                    binding.btnJoin.isEnabled = true
                    binding.btnJoin.text = "회원가입"

                    Toast.makeText(
                        this,
                        "회원가입이 완료되었습니다.",
                        Toast.LENGTH_SHORT
                    ).show()

                    finish()
                }

                is JoinState.Fail -> {
                    binding.btnJoin.isEnabled = true
                    binding.btnJoin.text = "회원가입"

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
