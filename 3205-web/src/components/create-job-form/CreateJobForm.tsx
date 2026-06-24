import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, UIEvent } from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../assets/close.svg'
import styles from './CreateJobForm.module.scss'

type CreateJobFormProps = {
  isOpen: boolean
  onClose: () => void
  onCreate: (urls: string[]) => void
}

type LineValidation = {
  isValid: boolean
  value: string
}

const urlPattern =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:\/[^\s]*)?$/

const isValidUrl = (value: string) => urlPattern.test(value.trim())

const getDuplicateLineValues = (values: string[]) => {
  const lineCounts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1

    return acc
  }, {})

  return new Set(
    Object.entries(lineCounts)
      .filter(([, count]) => count > 1)
      .map(([value]) => value),
  )
}

export function CreateJobForm({
  isOpen,
  onClose,
  onCreate,
}: CreateJobFormProps) {
  const highlightRef = useRef<HTMLDivElement>(null)
  const [urls, setUrls] = useState('')
  const [validatedLines, setValidatedLines] = useState<LineValidation[]>([])
  const [isInvalidLinesAcknowledged, setIsInvalidLinesAcknowledged] =
    useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const lines = urls.split('\n')

  useEffect(() => {
    const currentLines = urls.split('\n')
    const validationTimer = window.setTimeout(() => {
      setValidatedLines(
        currentLines.map((line) => ({
          isValid: isValidUrl(line),
          value: line,
        })),
      )
    }, 2000)

    return () => {
      window.clearTimeout(validationTimer)
    }
  }, [urls])

  const nonEmptyLines = lines
    .map((line, index) => ({
      line,
      validation: validatedLines[index],
    }))
    .filter(({ line }) => line.trim().length > 0)
  const duplicateLineValues = getDuplicateLineValues(
    nonEmptyLines
      .filter(({ line, validation }) => validation?.value === line)
      .map(({ line }) => line.trim()),
  )

  const hasPendingLines = nonEmptyLines.some(
    ({ line, validation }) => validation?.value !== line,
  )
  const hasInvalidUrlLines = nonEmptyLines.some(
    ({ line, validation }) =>
      validation?.value === line && validation.isValid === false,
  )
  const hasDuplicateLines = duplicateLineValues.size > 0
  const hasInvalidLines = hasInvalidUrlLines || hasDuplicateLines
  const hasValidLines =
    nonEmptyLines.length > 0 && !hasPendingLines && !hasInvalidLines
  const shouldShowInvalidLinesWarning =
    hasInvalidLines && !isInvalidLinesAcknowledged
  const isCreateButtonEnabled =
    hasValidLines ||
    (!hasPendingLines && hasInvalidLines && isInvalidLinesAcknowledged)
  const isAcknowledgeButtonEnabled = !hasPendingLines && hasInvalidLines
  const createButtonText = shouldShowInvalidLinesWarning
    ? 'Я понимаю'
    : 'Создать'
  const warningText = hasDuplicateLines
    ? hasInvalidUrlLines
      ? 'Есть некорректные строки и дубли'
      : 'Есть дубли строк'
    : 'Есть некорректные строки'

  const handleTextareaScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current === null) {
      return
    }

    highlightRef.current.scrollTop = event.currentTarget.scrollTop
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft
  }

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUrls(event.target.value)
    setIsInvalidLinesAcknowledged(false)
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleCreateButtonClick = () => {
    if (shouldShowInvalidLinesWarning) {
      setIsInvalidLinesAcknowledged(true)
      return
    }
    onCreate(nonEmptyLines.map(({ line }) => line.trim()))
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        aria-modal="true"
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className={styles.header}>
          <h2>Создать задание</h2>

          <button
            aria-label="Закрыть окно создания задания"
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <img src={closeIcon} alt="" />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.textareaWrap}>
            {urls.length > 0 && (
              <div
                aria-hidden="true"
                className={styles.highlight}
                ref={highlightRef}
              >
                {lines.map((line, index) => {
                  const trimmedLine = line.trim()
                  const validation = validatedLines[index]
                  const isDuplicateLine =
                    validation?.value === line &&
                    duplicateLineValues.has(trimmedLine)
                  const lineClassName =
                    trimmedLine.length === 0 || validation?.value !== line
                      ? styles.pendingLine
                      : validation.isValid && !isDuplicateLine
                      ? styles.validLine
                      : styles.invalidLine

                  return (
                    <div className={lineClassName} key={`${index}-${line}`}>
                      {line || ' '}
                    </div>
                  )
                })}
              </div>
            )}
            <textarea
              aria-label="Данные задания"
              className={styles.textarea}
              onChange={handleTextareaChange}
              onScroll={handleTextareaScroll}
              placeholder="Введите адреса для проверки"
              value={urls}
            />
          </div>
          <div className={styles.actions}>
            {shouldShowInvalidLinesWarning && (
              <p className={styles.warningText}>{warningText}</p>
            )}
            <button
              className={styles.submitButton}
              disabled={
                shouldShowInvalidLinesWarning
                  ? !isAcknowledgeButtonEnabled
                  : !isCreateButtonEnabled
              }
              onClick={handleCreateButtonClick}
              type="button"
            >
              {createButtonText}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  )
}
