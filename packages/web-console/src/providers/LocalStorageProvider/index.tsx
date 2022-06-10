/*******************************************************************************
 *     ___                  _   ____  ____
 *    / _ \ _   _  ___  ___| |_|  _ \| __ )
 *   | | | | | | |/ _ \/ __| __| | | |  _ \
 *   | |_| | |_| |  __/\__ \ |_| |_| | |_) |
 *    \__\_\\__,_|\___||___/\__|____/|____/
 *
 *  Copyright (c) 2014-2019 Appsicle
 *  Copyright (c) 2019-2022 QuestDB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 ******************************************************************************/

import React, {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
} from "react"
import { getValue, setValue } from "../../utils/localStorage"
import { StoreKey } from "../../utils/localStorage/types"
import { parseBoolean, parseInteger } from "./utils"
import { LocalConfig, SettingsType } from "./types"

/* eslint-disable prettier/prettier */
type Props = {}

const defaultConfig: LocalConfig = {
  authPayload: "",
  editorCol: 10,
  editorLine: 10,
  isNotificationEnabled: true,
  notificationDelay: 5,
  queryText: "",
  editorSplitterBasis: 350,
  resultsSplitterBasis: 350,
  exampleQueriesVisited: false,
}

type ContextProps = {
  authPayload: string
  editorCol: number
  editorLine: number
  notificationDelay: number
  isNotificationEnabled: boolean
  queryText: string
  editorSplitterBasis: number
  resultsSplitterBasis: number
  updateSettings: (key: StoreKey, value: SettingsType) => void
  exampleQueriesVisited: boolean
}

const defaultValues: ContextProps = {
  authPayload: "",
  editorCol: 1,
  editorLine: 1,
  isNotificationEnabled: true,
  notificationDelay: 5,
  queryText: "",
  editorSplitterBasis: 350,
  resultsSplitterBasis: 350,
  updateSettings: (key: StoreKey, value: SettingsType) => undefined,
  exampleQueriesVisited: false,
}

export const LocalStorageContext = createContext<ContextProps>(defaultValues)

export const LocalStorageProvider = ({
  children,
}: PropsWithChildren<Props>) => {
  const [authPayload, setAuthPayload] = useState<string>(
    getValue(StoreKey.AUTH_PAYLOAD),
  )
  const [editorCol, setEditorCol] = useState<number>(
    parseInteger(getValue(StoreKey.EDITOR_COL), defaultConfig.editorCol),
  )
  const [editorLine, setEditorLine] = useState<number>(
    parseInteger(getValue(StoreKey.EDITOR_LINE), defaultConfig.editorLine),
  )
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(
    parseBoolean(
      getValue(StoreKey.NOTIFICATION_ENABLED),
      defaultConfig.isNotificationEnabled,
    ),
  )
  const [notificationDelay, setNotificationDelay] = useState<number>(
    parseInteger(
      getValue(StoreKey.NOTIFICATION_DELAY),
      defaultConfig.notificationDelay,
    ),
  )
  const [queryText, setQueryText] = useState<string>(
    getValue(StoreKey.QUERY_TEXT),
  )
  const [editorSplitterBasis, seteditorSplitterBasis] = useState<number>(
    parseInteger(
      getValue(StoreKey.EDITOR_SPLITTER_BASIS),
      defaultConfig.editorSplitterBasis,
    ),
  )
  const [resultsSplitterBasis, setresultsSplitterBasis] = useState<number>(
    parseInteger(
      getValue(StoreKey.RESULTS_SPLITTER_BASIS),
      defaultConfig.resultsSplitterBasis,
    ),
  )

  const [exampleQueriesVisited, setExampleQueriesVisited] = useState<boolean>(
    getValue(StoreKey.EXAMPLE_QUERIES_VISITED) === "true",
  )

  const updateSettings = (key: StoreKey, value: SettingsType) => {
    setValue(key, value.toString())
    refreshSettings(key)
  }

  const refreshSettings = (key: StoreKey) => {
    const value = getValue(key)
    switch (key) {
      case StoreKey.AUTH_PAYLOAD:
        setAuthPayload(value)
        break
      case StoreKey.EDITOR_COL:
        setEditorCol(parseInteger(value, defaultConfig.editorCol))
        break
      case StoreKey.EDITOR_LINE:
        setEditorLine(parseInteger(value, defaultConfig.editorLine))
        break
      case StoreKey.EXAMPLE_QUERIES_VISITED:
        setExampleQueriesVisited(value === "true")
        break
      case StoreKey.NOTIFICATION_ENABLED:
        setIsNotificationEnabled(
          parseBoolean(value, defaultConfig.isNotificationEnabled),
        )
        break
      case StoreKey.NOTIFICATION_DELAY:
        setNotificationDelay(
          parseInteger(value, defaultConfig.notificationDelay),
        )
        break
      case StoreKey.QUERY_TEXT:
        setQueryText(value)
        break
      case StoreKey.EDITOR_SPLITTER_BASIS:
        seteditorSplitterBasis(
          parseInteger(value, defaultConfig.editorSplitterBasis),
        )
        break
      case StoreKey.RESULTS_SPLITTER_BASIS:
        setresultsSplitterBasis(
          parseInteger(value, defaultConfig.resultsSplitterBasis),
        )
        break
    }
  }

  return (
    <LocalStorageContext.Provider
      value={{
        authPayload,
        editorCol,
        editorLine,
        isNotificationEnabled,
        notificationDelay,
        queryText,
        editorSplitterBasis,
        resultsSplitterBasis,
        updateSettings,
        exampleQueriesVisited,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}

export const useLocalStorage = () => {
  return useContext(LocalStorageContext)
}
/* eslint-enable prettier/prettier */
