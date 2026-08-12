package kr.ac.anu.checklist.presentation.ui.main.history

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import kr.ac.anu.checklist.R
import kr.ac.anu.checklist.databinding.ItemHistoryBinding
import kr.ac.anu.checklist.presentation.viewmodel.main.HistoryUiModel

class HistoryAdapter :
    RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder>() {
    private val items = mutableListOf<HistoryUiModel>()

    fun submitList(newItems: List<HistoryUiModel>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): HistoryViewHolder {
        val binding = ItemHistoryBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )

        return HistoryViewHolder(binding)
    }

    override fun onBindViewHolder(
        holder: HistoryViewHolder,
        position: Int
    ) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class HistoryViewHolder(
        private val binding: ItemHistoryBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: HistoryUiModel) {
            val context = binding.root.context
            val isAllChecked = item.checkedCount == item.totalCount

            binding.tvHistoryDate.text = item.date
            binding.tvHistoryDay.text = item.dayOfWeek
            binding.tvHistoryStatus.text = item.status
            binding.tvHistoryCount.text = "${item.checkedCount} / ${item.totalCount}"

            binding.tvHistoryMessage.text =
                if (isAllChecked) {
                    "모든 항목을 완료했어요"
                } else {
                    "일부 항목을 완료하지 못했어요"
                }

            val statusColor =
                if (isAllChecked) {
                    ContextCompat.getColor(context, R.color.check_300)
                } else {
                    ContextCompat.getColor(context, R.color.orange_history)
                }

            binding.tvHistoryStatus.setTextColor(statusColor)
            binding.tvHistoryCount.setTextColor(statusColor)
        }
    }
}
