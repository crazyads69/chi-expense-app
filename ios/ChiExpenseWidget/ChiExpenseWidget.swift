import WidgetKit
import SwiftUI

struct ExpenseWidgetEntry: TimelineEntry {
    let date: Date
    let monthLabel: String
    let totalSpending: Double
    let currency: String
    let transactionCount: Int
    let trend: [Double] // last 6 data points for sparkline
}

struct Provider: IntentTimelineProvider {
    typealias Intent = ConfigurationIntent

    func placeholder(in context: Context) -> ExpenseWidgetEntry {
        ExpenseWidgetEntry(
            date: Date(),
            monthLabel: "This Month",
            totalSpending: 2450000,
            currency: "VND",
            transactionCount: 42,
            trend: [1.2, 1.5, 1.1, 1.8, 2.2, 2.4]
        )
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (ExpenseWidgetEntry) -> Void) {
        let entry = loadWidgetData()
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<ExpenseWidgetEntry>) -> Void) {
        let entry = loadWidgetData()
        // Refresh every 15 minutes at minimum; actual updates triggered by app
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadWidgetData() -> ExpenseWidgetEntry {
        guard let defaults = UserDefaults(suiteName: "group.com.chiexpense.app") else {
            return placeholder(in: Context())
        }

        let monthLabel = defaults.string(forKey: "widget_monthLabel") ?? "Current Month"
        let total = defaults.double(forKey: "widget_total")
        let currency = defaults.string(forKey: "widget_currency") ?? "VND"
        let count = defaults.integer(forKey: "widget_count")
        let trend = defaults.array(forKey: "widget_trend") as? [Double] ?? []

        return ExpenseWidgetEntry(
            date: Date(),
            monthLabel: monthLabel,
            totalSpending: total,
            currency: currency,
            transactionCount: count,
            trend: trend
        )
    }
}

struct ChiExpenseWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family
    @Environment(\.widgetRenderingMode) var renderingMode
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        Group {
            switch family {
            case .systemSmall:
                SmallWidgetView(entry: entry)
            case .systemMedium:
                MediumWidgetView(entry: entry)
            case .systemLarge:
                LargeWidgetView(entry: entry)
            default:
                SmallWidgetView(entry: entry)
            }
        }
        .containerBackground(for: .widget) {
            Color(colorScheme == .dark ? .black : .white)
        }
    }
}

struct SmallWidgetView: View {
    let entry: ExpenseWidgetEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Spending")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(formatCurrency(entry.totalSpending, entry.currency))
                .font(.title3)
                .fontWeight(.bold)
                .lineLimit(1)
                .minimumScaleFactor(0.6)
            Text(entry.monthLabel)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(12)
    }
}

struct MediumWidgetView: View {
    let entry: ExpenseWidgetEntry

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Monthly Spending")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(formatCurrency(entry.totalSpending, entry.currency))
                    .font(.title2)
                    .fontWeight(.bold)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
                Text("\(entry.transactionCount) transactions")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            if !entry.trend.isEmpty {
                MiniSparkline(data: entry.trend)
                    .frame(width: 80, height: 40)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(16)
    }
}

struct LargeWidgetView: View {
    let entry: ExpenseWidgetEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Monthly Spending")
                        .font(.headline)
                    Text(formatCurrency(entry.totalSpending, entry.currency))
                        .font(.title)
                        .fontWeight(.bold)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("\(entry.transactionCount)")
                        .font(.title2)
                        .fontWeight(.semibold)
                    Text("transactions")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            if !entry.trend.isEmpty {
                MiniSparkline(data: entry.trend)
                    .frame(height: 60)
            }
            Text(entry.monthLabel)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(16)
    }
}

struct MiniSparkline: View {
    let data: [Double]

    var body: some View {
        GeometryReader { geo in
            let width = geo.size.width
            let height = geo.size.height
            let maxVal = data.max() ?? 1
            let minVal = data.min() ?? 0
            let range = maxVal - minVal
            let stepX = width / CGFloat(max(data.count - 1, 1))

            Path { path in
                for (index, value) in data.enumerated() {
                    let x = CGFloat(index) * stepX
                    let y = height - ((value - minVal) / range) * height
                    let point = CGPoint(x: x, y: y)
                    if index == 0 {
                        path.move(to: point)
                    } else {
                        path.addLine(to: point)
                    }
                }
            }
            .stroke(Color.accentColor, lineWidth: 2)
        }
    }
}

func formatCurrency(_ amount: Double, _ currency: String) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal
    formatter.groupingSeparator = "."
    formatter.decimalSeparator = ","
    formatter.maximumFractionDigits = 0
    if let formatted = formatter.string(from: NSNumber(value: amount)) {
        return "\(formatted) \(currency)"
    }
    return "\(Int(amount)) \(currency)"
}

struct ChiExpenseWidget: Widget {
    let kind: String = "ChiExpenseWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            ChiExpenseWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Chi Expense")
        .description("Track your monthly spending at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
