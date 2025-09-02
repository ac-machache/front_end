"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "./ui/button"

interface DynamicDisplayProps {
  data: Record<string, unknown>
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const RenderData = ({ data }: DynamicDisplayProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        if (isObject(value)) {
          return (
            <Collapsible key={key} className="space-y-2">
              <div className="flex items-center justify-between space-x-4">
                <h4 className="text-sm font-semibold">{key}</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="rounded-md border p-4">
                  <RenderData data={value} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        }
        if (Array.isArray(value)) {
          return (
            <div key={key}>
              <h4 className="text-sm font-semibold">{key}</h4>
              <div className="pl-4">
                {value.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>{String(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        return (
          <div key={key} className="flex justify-between text-sm">
            <span className="font-semibold">{key}:</span>
            <span>{String(value)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function DynamicDisplay({ data }: DynamicDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        <RenderData data={data} />
      </CardContent>
    </Card>
  )
}
