package kr.ac.anu.checklist.presentation.ui.main

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import dagger.hilt.android.AndroidEntryPoint
import kr.ac.anu.checklist.R
import kr.ac.anu.checklist.databinding.FragmentHistoryBinding
import kr.ac.anu.checklist.presentation.ui.main.history.HistoryAdapter
import kr.ac.anu.checklist.presentation.viewmodel.main.HistoryState
import kr.ac.anu.checklist.presentation.viewmodel.main.HistoryViewModel

@AndroidEntryPoint
class HistoryFragment : Fragment(R.layout.fragment_history) {
    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = requireNotNull(_binding)

    private val historyViewModel: HistoryViewModel by viewModels()

    private val historyAdapter = HistoryAdapter()

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?
    ) {
        super.onViewCreated(view, savedInstanceState)

        _binding = FragmentHistoryBinding.bind(view)

        initRecyclerView()
        observeHistoryState()

        historyViewModel.loadHistory()
    }

    private fun initRecyclerView() {
        binding.rvHistory.apply {
            adapter = historyAdapter
            layoutManager = LinearLayoutManager(requireContext())
            setHasFixedSize(false)
        }
    }

    private fun observeHistoryState() {
        historyViewModel.historyState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is HistoryState.Loading -> {
                    // 로딩 UI 필요하면 여기서 처리
                }

                is HistoryState.Success -> {
                    binding.tvVisitCount.text = "${state.visitCount}회"
                    binding.tvAverageRate.text = "${state.averageRate}%"

                    historyAdapter.submitList(state.histories)
                }

                is HistoryState.Fail -> {
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
