'use client';

import { ScanEntry } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { History, Trash2, ChevronRight, FileText } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
        <div className="h-24 w-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-slate-300" />
        </div>
        <h4 className="font-bold text-slate-800 text-xl mb-2">Vault Empty</h4>
        <p className="text-sm text-slate-400 max-w-[200px] font-medium leading-relaxed">Transmitted data will be archived in this sector.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-[#0a192f]">
          <History className="h-7 w-7 text-accent" />
          Encrypted Ledger
        </h3>
        <span className="text-[11px] font-black bg-slate-100 px-3 py-1 rounded-lg text-slate-500 uppercase tracking-widest border border-slate-200">
          {history.length} Units
        </span>
      </div>
      
      <ScrollArea className="h-[500px] -mx-6 px-6">
        <div className="space-y-5">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-5 p-4 rounded-[1.75rem] bg-slate-50 hover:bg-white cursor-pointer transition-all border border-transparent hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-20 w-20 rounded-[1.25rem] overflow-hidden bg-white shadow-sm flex-shrink-0 border border-slate-100 p-0.5">
                <div className="h-full w-full rounded-[1rem] overflow-hidden relative">
                  <Image
                    src={scan.photoDataUri}
                    alt={scan.breedName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-lg truncate text-[#0a192f] group-hover:text-accent transition-colors">{scan.breedName}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight">
                    {formatDistanceToNow(scan.timestamp)} ago
                  </p>
                  <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tight">{scan.confidence}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-destructive transition-all h-10 w-10 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(scan.id);
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}