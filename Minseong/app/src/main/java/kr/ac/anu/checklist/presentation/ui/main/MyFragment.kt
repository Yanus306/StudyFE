package kr.ac.anu.checklist.presentation.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import dagger.hilt.android.AndroidEntryPoint
import kr.ac.anu.checklist.R
import kr.ac.anu.checklist.databinding.FragmentMyBinding
import kr.ac.anu.checklist.presentation.ui.auth.LoginActivity
import kr.ac.anu.checklist.presentation.viewmodel.main.MyState
import kr.ac.anu.checklist.presentation.viewmodel.main.MyViewModel

@AndroidEntryPoint
class MyFragment : Fragment(R.layout.fragment_my) {
    private var _binding: FragmentMyBinding? = null
    private val binding get() = requireNotNull(_binding)

    private val myViewModel: MyViewModel by viewModels()

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?
    ) {
        super.onViewCreated(view, savedInstanceState)

        _binding = FragmentMyBinding.bind(view)

        observeMyState()
        initClickListeners()

        myViewModel.loadMyInfo()
    }

    private fun initClickListeners() {
        binding.layoutModifyClick.setOnClickListener {
            Toast.makeText(
                requireContext(),
                "정보 수정 기능은 준비 중입니다.",
                Toast.LENGTH_SHORT
            ).show()
        }

        binding.layoutAppInfoClick.setOnClickListener {
            Toast.makeText(
                requireContext(),
                "안전 체크 v1.0.0",
                Toast.LENGTH_SHORT
            ).show()
        }

        binding.btnLogout.setOnClickListener {
            myViewModel.logout()
        }
    }

    private fun observeMyState() {
        myViewModel.myState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is MyState.Idle -> Unit

                is MyState.Loading -> Unit

                is MyState.Success -> {
                    val user = state.user

                    binding.tvTitle.text = "${user.name} 작업자님"
                    binding.tvName.text = user.name
                    binding.tvTeam.text = user.affiliation
                    binding.tvPosition.text = user.position
                }

                is MyState.LogoutSuccess -> {
                    val intent = Intent(requireContext(), LoginActivity::class.java)
                    intent.flags =
                        Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                }

                is MyState.Fail -> {
                    Toast.makeText(
                        requireContext(),
                        state.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
