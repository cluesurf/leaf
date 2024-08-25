import React from 'react'

type FooterInput = {
  children: React.ReactNode
}

type NavInput = {
  children: React.ReactNode
}

function Nav({ children }: NavInput) {
  return (
    <div className="items-center flex-col gap-32 justify-center py-32 px-16">
      {children}
    </div>
  )
}

type ContainerInput = {
  children: React.ReactNode
}

function Container({ children }: ContainerInput) {
  return <footer className="h-128 text-center">{children}</footer>
}

type FooterLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  children: React.ReactNode
}

function FooterLink({ children, ...props }: FooterLinkProps) {
  return (
    <a
      {...props}
      className={`hover:opacity-70 text-base transition-all`}
    >
      {children}
    </a>
  )
}

type UlInput = {
  children: React.ReactNode
}

function Ul({ children }: UlInput) {
  return (
    <ul className="items-center flex flex-wrap gap-16 text-base justify-center list-none">
      {children}
    </ul>
  )
}

type FooterItemInput = React.ComponentPropsWithoutRef<'a'> & {
  link: string
  text: string
}

function FooterItem({ link, text, ...props }: FooterItemInput) {
  return (
    <li>
      <FooterLink
        href={link}
        {...props}
      >
        {text}
      </FooterLink>
    </li>
  )
}

Footer.Item = FooterItem

export default function Footer({ children }: FooterInput) {
  return (
    <Container>
      <Nav>
        <Ul>{children}</Ul>
      </Nav>
    </Container>
  )
}
