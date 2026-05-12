
'use client';

import { ScanEntry } from '@/lib/storage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { History, Info } from 'lucide-react';
import Image from 'next/image';

interface ScanLedgerProps {
  history: ScanEntry[];
  onSelect: (entry: ScanEntry) => void;
}

export function ScanLedger({ history, onSelect }: ScanLedgerProps) {
  if (history.length === 0) {
    return (
      <Card className="bg-card/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center">
          <History className="h-8 w-8 mb-2 opacity-20" />
          <p className="text-sm">No recent scans. Your identification history will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Scans
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelect(scan)}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-all border border-transparent hover:border-primary/10"
            >
              <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={scan.photoDataUri}
                  alt={scan.breedName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{scan.breedName}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {formatDistanceToNow(scan.timestamp)} ago • {scan.confidence} confidence
                </p>
              </div>
              <Info className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
