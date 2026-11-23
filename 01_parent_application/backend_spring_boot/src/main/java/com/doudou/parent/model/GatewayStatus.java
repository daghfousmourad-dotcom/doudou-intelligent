package com.doudou.parent.model;

public record GatewayStatus(
    boolean channelOpen,
    String toyIp,
    int toyPort,
    String securityProtocol,
    String statusMessage
) {}
