
'use client';

import { ScanEntry } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { History, Trash2, ChevronRight } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <History className="h-8 w-8 text-slate-200" />
        </div>
        <h4 className="font-bold text-slate-800 mb-1">No Records Found</h4>
        <p className="text-xs text-slate-400 max-w-[180px]">Your analytical history will be archived here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Ledger
        </h3>
        <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">
          {history.length} Entries
        </span>
      </div>
      
      <ScrollArea className="h-[450px] -mx-4 px-4">
        <div className="space-y-4">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-4 p-3 rounded-[1.25rem] bg-slate-50 hover:bg-primary/5 cursor-pointer transition-all border border-transparent hover:border-primary/10"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{scan.breedName}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                  {formatDistanceToNow(scan.timestamp)} ago • {scan.confidence}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-destructive transition-all h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(scan.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
