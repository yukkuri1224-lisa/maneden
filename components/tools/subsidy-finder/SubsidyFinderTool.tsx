"use client";

import { useMemo } from "react";

import { ShareBar } from "@/components/common/ShareBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { findSubsidies } from "@/lib/calculators/subsidy-finder";
import {
  DEFAULT_INPUT,
  decodeInputFromParams,
  encodeInputToParams,
} from "@/lib/calculators/subsidy-finder/schema";
import { useUrlSyncedInput } from "@/lib/hooks/use-url-synced-input";

import { InputPanel } from "./InputPanel";
import { ResultList } from "./ResultList";

export function SubsidyFinderTool() {
  const {
    input,
    setInput,
    patch: update,
  } = useUrlSyncedInput(decodeInputFromParams, encodeInputToParams);

  const matches = useMemo(() => findSubsidies(input), [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <CardTitle className="text-base">事業の条件を入力</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput(DEFAULT_INPUT)}
            >
              リセット
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <InputPanel value={input} onChange={update} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <ResultList matches={matches} />
        <ShareBar
          shareText={`${matches.length}件の補助金候補が見つかりました！`}
          hashtags={["補助金", "まねでん"]}
          note="入力内容はURLに保存され、そのまま共有できます。"
        />
      </div>
    </div>
  );
}
