
'use client';

import { ScanEntry } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, ChevronRight, Database } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 text-center px-10 animate-in fade-in duration-[1000ms]">
        <div className="h-20 w-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100">
          <Database className="h-8 w-8 text-slate-200" />
        </div>
        <h4 className="font-bold text-slate-800 text-xl mb-2 font-headline">Vault Empty</h4>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Awaiting records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <ScrollArea className="h-[65vh] -mx-2 px-2">
        <div className="space-y-3">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-4 p-4 rounded-[2rem] bg-white border border-slate-100 hover:border-accent/10 hover:shadow-lg cursor-pointer transition-all duration-300"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-16 w-16 rounded-[1.2rem] overflow-hidden shadow-sm flex-shrink-0 border-2 border-white">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-[8px] font-bold text-accent uppercase">
                  {formatDistanceToNow(scan.timestamp)} ago
                </p>
                <h4 className="font-bold text-md truncate text-[#0F172A]">{scan.breedName}</h4>
                <Badge variant="outline" className="h-4 px-1.5 text-[7px] font-black uppercase text-emerald-600 border-emerald-50 bg-emerald-50/50">
                  Precision: {scan.confidence}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-destructive h-9 w-9 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(scan.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-accent transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
