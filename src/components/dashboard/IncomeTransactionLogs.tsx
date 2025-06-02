
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from 'lucide-react';
import { incomeLogService, IncomeTransactionLog } from '@/services/incomeLogService';

const IncomeTransactionLogs: React.FC = () => {
  const [logs, setLogs] = useState<IncomeTransactionLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const logsData = await incomeLogService.fetchAll();
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDetails = (details: any) => {
    if (!details) return 'N/A';
    if (typeof details === 'string') return details;
    return JSON.stringify(details, null, 2);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'filter_income_transactions':
        return 'bg-blue-500';
      case 'transaction_processed':
        return 'bg-green-500';
      case 'calculation_completed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Income Transaction Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {logs.length} logs
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Chargement des logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Aucun log trouvé.</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Composant</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-white text-xs ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.component}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.transaction_id ? log.transaction_id.substring(0, 8) + '...' : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800">
                          Voir détails
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
                          {formatDetails(log.details)}
                        </pre>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeTransactionLogs;
