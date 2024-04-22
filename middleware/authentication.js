import { validateToken } from "../services/auth.js"

export const checkAuthenticationCookie = (cookieName) => {
   return (req, res, next) => {
      const tokenValue = req.cookies[cookieName]
      if (!tokenValue) {
        return next()
      }
      try {
         const payload = validateToken(tokenValue)
         req.user = payload
      } catch (error) { }
      return next()
   }
}