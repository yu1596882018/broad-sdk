/**
 * 日志工具类（支持log4js、ES、Koa等）
 * 支持请求、响应、错误、MySQL、调试、前端上报等多种日志格式化与存储
 *
 * @author yu1596882018
 */
const log4js = require('log4js');
const useragent = require('useragent');
const uuidv1 = require('uuid/v1');
const isProduction = process.env.NODE_ENV === 'production';

/**
 * 获取用户IP
 * @param {Object} req - Koa request对象
 * @returns {string}
 */
function getUserIp(req) {
  return (
    req.headers['x-forwarded-for'] ||
    (req.connection && req.connection.remoteAddress) ||
    (req.socket && req.socket.remoteAddress) ||
    (req.connection && req.connection.socket.remoteAddress) ||
    req.ip
  );
}

/**
 * 格式化响应日志
 * @param {Object} ctx - Koa context
 * @param {number} resTime - 响应时间
 * @returns {Object}
 */
function formatRes(ctx, resTime) {
  let logText = '';
  const logObj = {};
  logText += '\n*************** response log start ***************\n';
  const reqLog = formatReqLog(ctx, resTime, logObj);
  logText += reqLog.logText;
  logText += `response status: ${ctx.status}\n`;
  logObj.responseStatus = ctx.status;
  logText += `response body: \n${JSON.stringify(ctx.body)}\n`;
  logObj.responseBody = JSON.stringify(ctx.body);
  logText += '*************** response log end ***************\n';
  return { logText, logObj };
}

/**
 * 格式化错误日志
 * @param {Object} ctx - Koa context
 * @param {Error} err - 错误对象
 * @param {number} resTime - 响应时间
 * @returns {Object}
 */
function formatError(ctx, err, resTime) {
  let logText = '';
  const logObj = {};
  logText += '\n*************** error log start ***************\n';
  const reqLog = formatReqLog(ctx, resTime, logObj);
  logText += reqLog.logText;
  logText += `err name: ${err.name}\n`;
  logObj.errName = err.name;
  logText += `err message: ${err.message}\n`;
  logObj.errMessage = err.message;
  logText += `err stack: ${err.stack}\n`;
  logObj.errStack = err.stack;
  logText += '*************** error log end ***************\n';
  return { logText, logObj };
}

/**
 * 格式化请求日志
 * @param {Object} ctx - Koa context
 * @param {number} resTime - 响应时间
 * @param {Object} logObj - 日志对象
 * @returns {Object}
 */
function formatReqLog(ctx, resTime, logObj = {}) {
  const req = ctx.request;
  let logText = '';
  const method = req.method;
  logText += `request method: ${method}\n`;
  logObj.requestMethod = method;
  logText += `request host:  ${ctx.host}\n`;
  logObj.requestHost = ctx.host;
  logText += `request originalUrl:  ${req.originalUrl}\n`;
  logObj.requestOriginalUrl = req.originalUrl;
  logText += `request matchedRoute:  ${ctx._matchedRoute || 'null'}\n`;
  logObj.requestMatchedRoute = ctx._matchedRoute || 'null';
  logText += `request client ip:  ${getUserIp(req)}\n`;
  logObj.ip = getUserIp(req);
  logText += `request params:  ${JSON.stringify(ctx.params)}\n`;
  logObj.requestParams = JSON.stringify(ctx.params);
  if (method === 'GET') {
    logText += `request query:  ${JSON.stringify(req.query)}\n`;
    logObj.requestQuery = JSON.stringify(req.query);
  } else {
    logText += `request body: \n${JSON.stringify(req.body)}\n`;
    logObj.requestBody = JSON.stringify(req.body);
  }
  logText += `request token: \n${ctx.request.headers.token}\n`;
  logObj.requestToken = ctx.request.headers.token;
  logText += `request sign: ${ctx.request.headers.sign}\n`;
  logObj.requestSign = ctx.request.headers.sign;
  logText += `response time: ${resTime}\n`;
  logObj.requestTime = resTime;
  logObj.timestamp = new Date();
  const agent = useragent.parse(req.headers['user-agent']);
  logObj.browser = agent.family;
  logObj.browserVersion = agent.toVersion();
  logObj.system = agent.os.family;
  logObj.systemVersion = agent.os.toVersion();
  logText += `userAgent: ${agent.toString()}\n`;
  return { logText, logObj };
}

/**
 * 整理前端上报日志体
 * @param {Object} reqBody - 请求体
 * @param {Object} reportBody - 日志体
 * @param {Object} req - Koa request对象
 */
function neatenWebReportBody(reqBody, reportBody, req) {
  reportBody.category = reqBody.category;
  reportBody.logType = reqBody.logType;
  Object.assign(reportBody, reqBody.deviceInfo || {});
  const agent = useragent.parse(reqBody.deviceInfo.userAgent);
  reportBody.browser = agent.family;
  reportBody.browserVersion = agent.toVersion();
  reportBody.timestamp = new Date();
  reportBody.ip = getUserIp(req);
}

/**
 * 日志工具类
 */
class LogUtil {
  /**
   * @param {Object} logConfig - log4js配置
   * @param {Object} esClient - ES客户端实例
   */
  constructor(logConfig, esClient) {
    log4js.configure(logConfig);
    this.errorLogger = log4js.getLogger('errorLogger');
    this.resLogger = log4js.getLogger('resLogger');
    this.mysqlLogger = log4js.getLogger('mysqlLogger');
    this.debugLogger = log4js.getLogger('DebugLogger');
    this.esClient = esClient;
  }

  /**
   * 记录错误日志
   * @param {Object} ctx - Koa context
   * @param {Error} error - 错误对象
   * @param {number} resTime - 响应时间
   */
  logError(ctx, error, resTime) {
    if (ctx && error) {
      const errLog = formatError(ctx, error, resTime);
      this.esClient.create({
        index: 'server_err_logs',
        type: '_doc',
        id: uuidv1(),
        pipeline: 'geoip',
        body: errLog.logObj,
      });
      this.errorLogger.error(errLog.logText);
    }
  }

  /**
   * 记录响应日志
   * @param {Object} ctx - Koa context
   * @param {number} resTime - 响应时间
   */
  logResponse(ctx, resTime) {
    if (ctx) {
      const resLog = formatRes(ctx, resTime);
      this.resLogger.info(resLog.logText);
      this.esClient.create({
        index: 'server_res_logs',
        type: '_doc',
        id: uuidv1(),
        pipeline: 'geoip',
        body: resLog.logObj,
      });
    }
  }

  /**
   * 记录MySQL日志
   * @param {string} sql - SQL语句
   * @param {string} ext_ts - 扩展信息
   */
  logMysql(sql, ext_ts) {
    if (!isProduction) {
      console.log(sql);
    }
    this.mysqlLogger.info(`${sql}\n`, ext_ts, '\n');
  }

  /**
   * 记录调试日志
   * @param {string} text - 日志内容
   * @param {string} fileName - 文件名
   */
  debugLog(text, fileName) {
    if (!fileName) fileName = '';
    this.debugLogger.info(`${fileName}: >>>>> ${text}`);
  }

  /**
   * 记录前端网络测速日志
   * @param {Object} ctx - Koa context
   */
  webNetworkSpeed(ctx) {
    const reqBody = ctx.request.body;
    const reportBody = {};
    neatenWebReportBody(reqBody, reportBody, ctx.request);
    reportBody.networkSpeed = reqBody.logInfo.networkSpeed;
    reportBody.pageId = reqBody.logInfo.pageId;
    this.esClient.create({
      index: 'web_network_speed_logs',
      type: '_doc',
      id: uuidv1(),
      pipeline: 'geoip',
      body: reportBody,
    });
  }

  /**
   * 记录前端错误日志
   * @param {Object} ctx - Koa context
   */
  webError(ctx) {
    const reqBody = ctx.request.body;
    const reportBody = {};
    neatenWebReportBody(reqBody, reportBody, ctx.request);
    reportBody.errorInfo = reqBody.logInfo;
    this.esClient.create({
      index: 'web_err_logs',
      type: '_doc',
      id: uuidv1(),
      pipeline: 'geoip',
      body: reportBody,
    });
  }

  /**
   * 记录前端性能日志
   * @param {Object} ctx - Koa context
   */
  webPerformance(ctx) {
    const reqBody = ctx.request.body;
    const reportBody = {};
    neatenWebReportBody(reqBody, reportBody, ctx.request);
    Object.assign(reportBody, reqBody.logInfo);
    this.esClient.create({
      index: 'web_performance_logs',
      type: '_doc',
      id: uuidv1(),
      pipeline: 'geoip',
      body: reportBody,
    });
  }
}

module.exports = LogUtil;
