package kr.ac.anu.checklist.presentation.viewmodel.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import kr.ac.anu.checklist.data.repository.CheckListRepository
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject

data class HomeCheckItem(
    val id: Int,
    val title: String,
    val isChecked: Boolean
)

sealed class HomeState {
    data object Idle : HomeState()
    data object Loading : HomeState()

    data class Success(
        val items: List<HomeCheckItem>,
        val isTodaySaved: Boolean
    ) : HomeState()

    data object SaveSuccess : HomeState()

    data class Fail(
        val message: String
    ) : HomeState()
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: CheckListRepository
) : ViewModel() {
    private val _homeState = MutableLiveData<HomeState>(HomeState.Idle)
    val homeState: LiveData<HomeState> = _homeState

    fun loadTodayCheckedItems() {
        viewModelScope.launch {
            try {
                val today = repository.getTodayCheckedItems()
                val checkedIds = today.checkedItemIds.toSet()

                val homeItems = (1..6).map { id ->
                    HomeCheckItem(
                        id = id,
                        title = "",
                        isChecked = checkedIds.contains(id)
                    )
                }

                // 현재 API 기준 임시 판단:
                // 오늘 체크된 항목이 하나라도 있으면 이미 저장한 것으로 간주
                val isTodaySaved = checkedIds.isNotEmpty()

                _homeState.value = HomeState.Success(
                    items = homeItems,
                    isTodaySaved = isTodaySaved
                )
            } catch (e: HttpException) {
                _homeState.value = HomeState.Fail("오늘 점검 상태를 불러오지 못했습니다. (${e.code()})")
            } catch (e: IOException) {
                _homeState.value = HomeState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _homeState.value = HomeState.Fail("오늘 점검 상태를 불러오는 중 오류가 발생했습니다.")
            }
        }
    }

    fun saveChecklist(
        checkedList: List<Boolean>
    ) {
        viewModelScope.launch {
            _homeState.value = HomeState.Loading

            try {
                checkedList.forEachIndexed { index, isChecked ->
                    val itemId = index + 1

                    if (isChecked) {
                        repository.checkItem(itemId)
                    } else {
                        repository.uncheckItem(itemId)
                    }
                }

                _homeState.value = HomeState.SaveSuccess
            } catch (e: HttpException) {
                _homeState.value = HomeState.Fail("점검 저장에 실패했습니다. (${e.code()})")
            } catch (e: IOException) {
                _homeState.value = HomeState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _homeState.value = HomeState.Fail("점검 저장 중 오류가 발생했습니다.")
            }
        }
    }
}
