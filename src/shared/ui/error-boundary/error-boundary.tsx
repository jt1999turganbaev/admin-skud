import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorScreen } from './error-screen'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: unknown
}

/**
 * Render paytidagi xatoni ushlaydi.
 *
 * Kutilmagan `null` (masalan, backend o'chirilgan bog'lanishni `null`
 * qaytarsa) butun ilovani oq ekranga aylantirmasligi uchun — router
 * `errorElement` i yetmaydigan joylarda shu chegara ishlaydi.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Diagnostika uchun — foydalanuvchiga ErrorScreen ko'rsatiladi.
    console.error('Render xatosi:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          error={this.state.error}
          onRetry={() => this.setState({ error: null })}
        />
      )
    }

    return this.props.children
  }
}
