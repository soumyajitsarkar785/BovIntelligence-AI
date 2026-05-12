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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
          <FileText className="h-10 w-10 text-slate-200" />
        </div>
        <h4 className="font-bold text-slate-800 text-xl mb-2">Vault is Empty</h4>
        <p className="text-sm text-slate-400 max-w-[200px] font-medium leading-relaxed">Your cattle analysis history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-[#0F172A]">
          <History className="h-7 w-7 text-accent" />
          Recent Records
        </h3>
        <Badge className="bg-slate-100 text-slate-500 border-none px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest">
          {history.length} Units
        </Badge>
      </div>
      
      <ScrollArea className="h-[450px] -mx-2 px-2">
        <div className="space-y-4">
          {history.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center gap-4 p-4 rounded-[2rem] bg-white border border-slate-100 hover:border-accent/20 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer transition-all duration-500"
              onClick={() => onSelect(scan)}
            >
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 border-white">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg truncate text-[#0F172A] mb-1 group-hover:text-accent transition-colors">{scan.breedName}</h4>
                <div className="flex items-center gap-2">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {formatDistanceToNow(scan.timestamp)} ago
                  </p>
                  <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                  <Badge variant="outline" className="h-5 px-2 text-[9px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50">
                    {scan.confidence}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-destructive transition-all h-10 w-10 rounded-full hover:bg-destructive/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(scan.id);
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
