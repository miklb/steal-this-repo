import { micropub } from '../config.js'

export default async (request) => micropub.micropubHandler(request)
