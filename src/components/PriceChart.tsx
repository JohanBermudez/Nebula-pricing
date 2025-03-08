import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../types';

interface PriceChartProps {
  data: ChartData[];
  multiSeries?: boolean;
  title?: string;
}

const PriceChart = ({ data, multiSeries = false, title }: PriceChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getMarketplaceColor = (marketplace: string) => {
    const colors: Record<string, string> = {
      'Mercado Libre': '#FFE600',
      'Éxito': '#FFCD00',
      'Falabella': '#DF0101',
      'Alkosto': '#1F45FC',
      'Olímpica': '#4C0B5F',
      'Jumbo': '#00A64F',
    };
    return colors[marketplace] || '#8884d8';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${formatDate(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {multiSeries && `${entry.payload.marketplace}: `}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full">
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="fecha"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {multiSeries ? (
            data
              .reduce((marketplaces, item) => {
                if (item.marketplace && !marketplaces.includes(item.marketplace)) {
                  marketplaces.push(item.marketplace);
                }
                return marketplaces;
              }, [] as string[])
              .map((marketplace) => (
                <Line
                  key={marketplace}
                  type="monotone"
                  dataKey="precio"
                  data={data.filter((item) => item.marketplace === marketplace)}
                  name={marketplace}
                  stroke={getMarketplaceColor(marketplace)}
                  activeDot={{ r: 8 }}
                />
              ))
          ) : (
            <Line
              type="monotone"
              dataKey="precio"
              stroke="#4F46E5"
              activeDot={{ r: 8 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
