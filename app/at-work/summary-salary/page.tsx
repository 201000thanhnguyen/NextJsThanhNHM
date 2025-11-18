import SummaryCard from "../components/SummaryCard";


export default function SummarySalaryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <SummaryCard>
                <div className="flex flex-col mb-2">
                    <label className="text-gray-700 font-medium mb-1 underline">Summary Salary</label>
                    <table className="table-fixed w-full text-left border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td>Total Shifts</td>
                                <td className="text-right">1.000.000 vnd</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td>Total Pay</td>
                                <td className="text-right">0 vnd</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td>Total Received</td>
                                <td className="text-right">0 vnd</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td>Total Unpaid</td>
                                <td className="text-right">0 vnd</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SummaryCard>
        </div>
    );
}
