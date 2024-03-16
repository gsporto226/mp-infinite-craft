export type Nullable<T> = T | null

export type RecursiveNonNullable<T extends Record<string, any>> = {
    [Key in keyof T]: T[Key] extends Record<string, any> ? RecursiveNonNullable<T[Key]> : NonNullable<T[Key]>
}
