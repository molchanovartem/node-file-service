export interface IRecognizeDocument {
    type: 'passport' | 'driver-license-front' | 'other',
    result: { name: string, text: string }[]
}