
'use client';

import { ScanEntry } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { History as HistoryIcon, Trash2, ChevronRight, FileText, Database } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ScanLedgerProps {
  history: ScanEntry[];
  onSelect: (entry: ScanEntry) => void;
  onDelete: (id: string) => void;
}

export function ScanLedger({ history, onSelect, onDelete }: ScanLedgerProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-10 animate-in fade-in duration-1000">
        <div className="h-28 w-28 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
          <Database className="h-12 w-12 text-slate-200" />
        </div>
        <h4 className="font-bold text-slate-800 text-2xl mb-3 font-headline">Archive Empty</h4>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">No genomic records found in the local ledger. Start a new scan to populate the vault.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <ScrollArea className="h-[60vh] -mx-2 px-2">
        <div className="space-y-5">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-5 p-5 rounded-[2.5rem] bg-white border border-slate-100 hover:border-accent/10 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-500 active:scale-[0.98]"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-20 w-20 rounded-[1.5rem] overflow-hidden shadow-md flex-shrink-0 border-[3px] border-white">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {scan.id}
                  </p>
                  <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                  <p className="text-[10px] font-black text-accent uppercase">
                    {formatDistanceToNow(scan.timestamp)}
                  </p>
                </div>
                <h4 className="font-bold text-lg truncate text-[#0F172A] group-hover:text-accent transition-colors">{scan.breedName}</h4>
                <Badge variant="outline" className="h-5 px-2 text-[8px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50">
                  {scan.confidence} PRECISION
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-destructive transition-all h-12 w-12 rounded-full hover:bg-destructive/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(scan.id);
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent/5 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-accent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

