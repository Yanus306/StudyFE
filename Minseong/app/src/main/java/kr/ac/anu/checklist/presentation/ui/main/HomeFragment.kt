package kr.ac.anu.checklist.presentation.ui.main

import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import dagger.hilt.android.AndroidEntryPoint
import kr.ac.anu.checklist.R
import kr.ac.anu.checklist.databinding.FragmentHomeBinding
import kr.ac.anu.checklist.databinding.ItemCheckBinding
import kr.ac.anu.checklist.presentation.viewmodel.main.HomeState
import kr.ac.anu.checklist.presentation.viewmodel.main.HomeViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@AndroidEntryPoint
class HomeFragment : Fragment(R.layout.fragment_home) {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = requireNotNull(_binding)

    private val homeViewModel: HomeViewModel by viewModels()

    private lateinit var checkItemBindings: List<ItemCheckBinding>

    private val checkTitles = listOf(
        "안전모 착용",
        "안전화 착용",
        "안전조끼 착용",
        "보호장갑 착용",
        "보호안경 착용",
        "건강 상태 이상 없음"
    )

    private val checkedList = MutableList(6) { false }

    private var isTodaySaved = false

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?
    ) {
        super.onViewCreated(view, savedInstanceState)

        _binding = FragmentHomeBinding.bind(view)

        initCheckItemBindings()
        initDefaultCheckItems()
        observeHomeState()
        setTodayTitle()
        updateHomeUi()

        homeViewModel.loadTodayCheckedItems()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun setTodayTitle() {
        val today = LocalDate.now()
        val formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd", Locale.KOREA)
        val todayText = today.format(formatter)

        binding.tvSubTitle.text = "$todayText 오늘의 점검"
    }

    private fun initCheckItemBindings() {
        checkItemBindings = listOf(
            binding.itemCheck1,
            binding.itemCheck2,
            binding.itemCheck3,
            binding.itemCheck4,
            binding.itemCheck5,
            binding.itemCheck6
        )
    }

    private fun initDefaultCheckItems() {
        checkItemBindings.forEachIndexed { index, itemBinding ->
            itemBinding.tvNumber.text = "${index + 1}"
            itemBinding.tvTitle.text = checkTitles[index]

            itemBinding.root.setOnClickListener {
                checkedList[index] = !checkedList[index]
                updateHomeUi()
            }
        }

        binding.btnAttendance.setOnClickListener {
            homeViewModel.saveChecklist(checkedList)
        }
    }

    private fun observeHomeState() {
        homeViewModel.homeState.observe(viewLifecycleOwner) { state ->
            when (state) {
                is HomeState.Idle -> Unit

                is HomeState.Loading -> {
                    binding.btnAttendance.isEnabled = false
                    binding.btnAttendance.alpha = 0.6f
                }

                is HomeState.Success -> {
                    state.items.forEachIndexed { index, item ->
                        if (index < checkedList.size) {
                            checkedList[index] = item.isChecked
                        }
                    }

                    isTodaySaved = state.isTodaySaved
                    updateHomeUi()
                }

                is HomeState.SaveSuccess -> {
                    isTodaySaved = true

                    Toast.makeText(
                        requireContext(),
                        "오늘의 안전 점검이 저장되었습니다.",
                        Toast.LENGTH_SHORT
                    ).show()

                    updateHomeUi()
                }

                is HomeState.Fail -> {
                    Toast.makeText(
                        requireContext(),
                        state.message,
                        Toast.LENGTH_SHORT
                    ).show()

                    updateHomeUi()
                }
            }
        }
    }

    private fun updateHomeUi() {
        val checkedCount = checkedList.count { it }
        val totalCount = checkedList.size

        binding.tvProgressCount.text = "$checkedCount / $totalCount"

        binding.tvProgressMessage.text =
            when {
                checkedCount == totalCount -> {
                    "모든 항목을\n체크했습니다!"
                }

                isTodaySaved -> {
                    "오늘 점검을\n수정할 수 있습니다."
                }

                else -> {
                    "오늘의 점검을\n진행해 주세요!"
                }
            }

        checkItemBindings.forEachIndexed { index, itemBinding ->
            itemBinding.ivCheck.setImageResource(
                if (checkedList[index]) {
                    R.drawable.ic_check2
                } else {
                    R.drawable.ic_check1
                }
            )

            itemBinding.root.isEnabled = true
            itemBinding.root.alpha = 1f
        }

        binding.btnAttendance.text =
            if (isTodaySaved) {
                "점검 수정 저장"
            } else {
                "점검 저장하기"
            }

        binding.btnAttendance.isEnabled = true
        binding.btnAttendance.alpha = 1f
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
