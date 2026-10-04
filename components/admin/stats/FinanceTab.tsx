import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import type { Transaction } from '../../../types/admin';
import type { TFunction } from '../../../context/LocaleContext';
import Button from '../../ui/Button';
import { TransactionStatus } from '../../../types';

interface FinanceTabProps {
    transactions: Transaction[];
    t: TFunction;
}

const FinanceTab: React.FC<FinanceTabProps> = ({ transactions, t }) => {
    return (
        <div className="animate-fade-in stagger-2">
            <div className="bg-panel-primary border border-border-medium rounded-3xl overflow-hidden flex flex-col h-[600px]">
                <div className="px-6 py-5 border-b border-border-light flex justify-between items-center bg-panel-primary flex-shrink-0">
                    <h3 className="font-bold text-white text-lg">
                        {t('admin.transactions.title')}
                    </h3>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                        {t('catalog.showAll')}
                    </Button>
                </div>

                <div className="flex-1 min-h-0">
                    <TableVirtuoso
                        data={transactions}
                        components={{
                            Table: (props) => (
                                <table {...props} className="w-full text-left border-collapse" />
                            ),
                            TableHead: React.forwardRef<
                                HTMLTableSectionElement,
                                React.HTMLAttributes<HTMLTableSectionElement>
                            >((props, ref) => (
                                <thead
                                    {...props}
                                    ref={ref}
                                    className="bg-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-wider sticky top-0 z-10 backdrop-blur-sm"
                                />
                            )),
                            TableBody: React.forwardRef<
                                HTMLTableSectionElement,
                                React.HTMLAttributes<HTMLTableSectionElement>
                            >((props, ref) => (
                                <tbody
                                    {...props}
                                    ref={ref}
                                    className="divide-y divide-border-light"
                                />
                            )),
                            TableRow: (props) => (
                                <tr {...props} className="hover:bg-white/5 transition-colors" />
                            ),
                        }}
                        fixedHeaderContent={() => (
                            <tr>
                                <th className="px-6 py-4 bg-panel-primary/95 border-b border-border-light">
                                    {t('admin.transactions.user')}
                                </th>
                                <th className="px-6 py-4 bg-panel-primary/95 border-b border-border-light">
                                    {t('admin.transactions.plan')}
                                </th>
                                <th className="px-6 py-4 bg-panel-primary/95 border-b border-border-light text-right">
                                    {t('admin.transactions.amount')}
                                </th>
                                <th className="px-6 py-4 bg-panel-primary/95 border-b border-border-light text-right">
                                    {t('admin.transactions.status')}
                                </th>
                            </tr>
                        )}
                        itemContent={(_index, tx) => (
                            <>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                                            {tx.user.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">
                                                {tx.user}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono">
                                                {tx.id} • {tx.date}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                                    {tx.plan}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-white text-right font-mono">
                                    {tx.amount}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            tx.status === TransactionStatus.Completed
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}
                                    >
                                        {tx.status === TransactionStatus.Completed
                                            ? t('admin.transactions.statusCompleted')
                                            : t('admin.transactions.statusPending')}
                                    </span>
                                </td>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinanceTab;
