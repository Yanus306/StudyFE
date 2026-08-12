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

data class HistoryUiModel(
    val date: String,
    val dayOfWeek: String,
    val status: String,
    val checkedCount: Int,
    val totalCount: Int
) {
    val isAllChecked: Boolean
        get() = checkedCount == totalCount
}

sealed class HistoryState {
    data object Loading : HistoryState()

    data class Success(
        val visitCount: Int,
        val averageRate: Int,
        val histories: List<HistoryUiModel>
    ) : HistoryState()

    data class Fail(
        val message: String
    ) : HistoryState()
}

@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val repository: CheckListRepository
) : ViewModel() {
    private val _historyState = MutableLiveData<HistoryState>()
    val historyState: LiveData<HistoryState> = _historyState

    fun loadHistory() {
        viewModelScope.launch {
            _historyState.value = HistoryState.Loading

            try {
                val response = repository.getHistory()

                val histories = response.history.map { item ->
                    HistoryUiModel(
                        date = item.date,
                        dayOfWeek = item.dayOfWeek,
                        status = item.status,
                        checkedCount = item.checkedCount,
                        totalCount = item.totalCount
                    )
                }

                _historyState.value = HistoryState.Success(
                    visitCount = response.visitCount,
                    averageRate = response.averageRate,
                    histories = histories
                )
            } catch (e: HttpException) {
                _historyState.value = HistoryState.Fail(
                    "내역을 불러오지 못했습니다. (${e.code()})"
                )
            } catch (e: IOException) {
                _historyState.value = HistoryState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _historyState.value = HistoryState.Fail("알 수 없는 오류가 발생했습니다.")
            }
        }
    }
}
