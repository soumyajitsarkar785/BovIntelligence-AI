
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-10 py-20 text-center animate-in fade-in duration-1000">
        <div className="h-16 w-16 bg-slate-50 rounded-lg flex items-center justify-center mb-6 border border-slate-100">
          <Database className="h-8 w-8 text-slate-200" />
        </div>
        <h4 className="font-bold text-slate-800 text-xl mb-2 font-headline">Vault Empty</h4>
        <p className="text-sm text-slate-500 font-semibold">Awaiting records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <ScrollArea className="h-[65vh]">
        <div className="space-y-3">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 cursor-pointer transition-colors hover:bg-slate-50"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-xs font-semibold text-slate-500">
                  {formatDistanceToNow(scan.timestamp)} ago
                </p>
                <h4 className="font-bold text-md truncate text-slate-950">{scan.breedName}</h4>
                <Badge variant="outline" className="h-5 px-2 text-[10px] font-bold text-emerald-700 border-emerald-100 bg-emerald-50">
                  Precision: {scan.confidence}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-destructive h-9 w-9 rounded-md"
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
