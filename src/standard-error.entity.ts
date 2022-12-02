/**    
    @ApiBadRequestResponse()
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiMethodNotAllowedResponse()
    @ApiNotAcceptableResponse()
    @ApiRequestTimeoutResponse()
    @ApiConflictResponse()
    @ApiPreconditionFailedResponse()
    @ApiTooManyRequestsResponse()
    @ApiGoneResponse()
    @ApiPayloadTooLargeResponse()
    @ApiUnsupportedMediaTypeResponse()
    @ApiUnprocessableEntityResponse()
    @ApiInternalServerErrorResponse()
    @ApiNotImplementedResponse()
    @ApiBadGatewayResponse()
    @ApiServiceUnavailableResponse()
    @ApiGatewayTimeoutResponse()
    @ApiDefaultResponse()
 */

export class ApiReponseTypeBadRequest {
  statusCode: 400;
  message: string;
  error: string;
}

export class ApiReponseTypeUnauthorized {
  statusCode: 401;
  message: string;
  error: string;
}

export class ApiReponseTypeForbidden {
  statusCode: 403;
  message: string;
  error: string;
}

export class ApiReponseTypeNotFound {
  statusCode: 404;
  message: string;
  error: string;
}

export class ApiReponseTypeMethodNotAllowed {
  statusCode: 405;
  message: string;
  error: string;
}

export class ApiReponseTypeNotAcceptable {
  statusCode: 406;
  message: string;
  error: string;
}

export class ApiReponseTypeRequestTimeout {
  statusCode: 408;
  message: string;
  error: string;
}

export class ApiReponseTypeConflict {
  statusCode: 409;
  message: string;
  error: string;
}

export class ApiReponseTypeGone {
  statusCode: 410;
  message: string;
  error: string;
}

export class ApiReponseTypePayloadTooLarge {
  statusCode: 413;
  message: string;
  error: string;
}

export class ApiReponseTypeUnsupportedMediaType {
  statusCode: 415;
  message: string;
  error: string;
}

export class ApiReponseTypeUnprocessableEntity {
  statusCode: 422;
  message: string;
  error: string;
}

export class ApiReponseTypeInternalServerError {
  statusCode: 500;
  message: string;
  error: string;
}

export class ApiReponseTypeNotImplemented {
  statusCode: 501;
  message: string;
  error: string;
}

export class ApiReponseTypeBadGateway {
  statusCode: 502;
  message: string;
  error: string;
}

export class ApiReponseTypeServiceUnavailable {
  statusCode: 503;
  message: string;
  error: string;
}

export class ApiReponseTypeGatewayTimeout {
  statusCode: 504;
  message: string;
  error: string;
}

export class ApiReponseTypeDefault {
  statusCode: number;
  message: string;
  error: string;
}
